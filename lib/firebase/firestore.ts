import { adminDb } from './admin'
import { FieldValue } from 'firebase-admin/firestore'
import type { KnowledgeItem, CreateKnowledgeItem } from '@/types'

// ==========================================
// User Profile
// ==========================================

export async function createUserProfile(userId: string, email: string, displayName?: string) {
    const userRef = adminDb.collection('users').doc(userId)
    const existing = await userRef.get()

    if (!existing.exists) {
        await userRef.set({
            email,
            displayName: displayName || email.split('@')[0],
            onboardingComplete: false,
            createdAt: FieldValue.serverTimestamp(),
        })
    }
    return userRef
}

export async function getUserProfile(userId: string) {
    const doc = await adminDb.collection('users').doc(userId).get()
    if (!doc.exists) return null
    return { id: doc.id, ...doc.data() }
}

export async function updateUserProfile(userId: string, data: Record<string, unknown>) {
    await adminDb.collection('users').doc(userId).update(data)
}

// ==========================================
// Knowledge Items
// ==========================================

export async function createKnowledgeItem(
    userId: string,
    item: CreateKnowledgeItem
): Promise<KnowledgeItem> {
    const docRef = await adminDb.collection('knowledge_items').add({
        userId,
        title: item.title,
        content: item.content,
        type: item.type,
        sourceUrl: item.source_url || null,
        tags: item.tags || [],
        summary: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    })

    const doc = await docRef.get()
    const data = doc.data()!

    return {
        id: doc.id,
        user_id: userId,
        title: data.title,
        content: data.content,
        type: data.type,
        source_url: data.sourceUrl,
        tags: data.tags,
        summary: data.summary,
        created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }
}

export async function getKnowledgeItems(
    userId: string,
    options: {
        type?: string
        tags?: string[]
        search?: string
        limit?: number
        offset?: number
    } = {}
): Promise<{ items: KnowledgeItem[]; count: number }> {
    const { type, search, limit = 50 } = options

    let query = adminDb
        .collection('knowledge_items')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)

    if (type) {
        query = query.where('type', '==', type)
    }

    const snapshot = await query.get()

    let items: KnowledgeItem[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            user_id: data.userId,
            title: data.title,
            content: data.content,
            type: data.type,
            source_url: data.sourceUrl,
            tags: data.tags || [],
            summary: data.summary,
            created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updated_at: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }
    })

    // Client-side text search (Firestore doesn't support full-text search natively)
    if (search) {
        const searchLower = search.toLowerCase()
        items = items.filter(
            (item) =>
                item.title.toLowerCase().includes(searchLower) ||
                item.content.toLowerCase().includes(searchLower)
        )
    }

    // Client-side tag filter (Firestore has limited array-contains-any)
    if (options.tags && options.tags.length > 0) {
        items = items.filter((item) =>
            options.tags!.some((tag) => item.tags.includes(tag))
        )
    }

    return { items, count: items.length }
}

export async function getKnowledgeItem(
    userId: string,
    itemId: string
): Promise<KnowledgeItem | null> {
    const doc = await adminDb.collection('knowledge_items').doc(itemId).get()
    if (!doc.exists) return null

    const data = doc.data()!
    if (data.userId !== userId) return null // Security: only owner can read

    return {
        id: doc.id,
        user_id: data.userId,
        title: data.title,
        content: data.content,
        type: data.type,
        source_url: data.sourceUrl,
        tags: data.tags || [],
        summary: data.summary,
        created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }
}

export async function deleteKnowledgeItem(userId: string, itemId: string): Promise<boolean> {
    const doc = await adminDb.collection('knowledge_items').doc(itemId).get()
    if (!doc.exists) return false

    const data = doc.data()!
    if (data.userId !== userId) return false // Security check

    await adminDb.collection('knowledge_items').doc(itemId).delete()
    return true
}

export async function updateKnowledgeItem(
    itemId: string,
    data: Partial<Record<string, unknown>>
) {
    await adminDb.collection('knowledge_items').doc(itemId).update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
    })
}

// ==========================================
// Knowledge Item Stats
// ==========================================

export async function getKnowledgeStats(userId: string) {
    const snapshot = await adminDb
        .collection('knowledge_items')
        .where('userId', '==', userId)
        .get()

    const items = snapshot.docs.map((doc) => doc.data())

    const totalNotes = items.filter((i) => i.type === 'note').length
    const totalLinks = items.filter((i) => i.type === 'link').length
    const totalInsights = items.filter((i) => i.type === 'insight').length
    const allTags = new Set(items.flatMap((i) => i.tags || []))

    // Get items from this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentItems = items.filter((i) => {
        const createdAt = i.createdAt?.toDate?.()
        return createdAt && createdAt >= weekAgo
    })

    return {
        total: items.length,
        notes: totalNotes,
        links: totalLinks,
        insights: totalInsights,
        tags: allTags.size,
        recentCount: recentItems.length,
    }
}

// ==========================================
// Search (keyword + AI reranking helper)
// ==========================================

export async function searchKnowledgeItems(
    userId: string,
    query: string,
    limit = 10
): Promise<KnowledgeItem[]> {
    // Get all user items and do text matching
    const { items } = await getKnowledgeItems(userId, { limit: 200 })

    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(/\s+/).filter(Boolean)

    // Score each item
    const scored = items.map((item) => {
        let score = 0
        const titleLower = item.title.toLowerCase()
        const contentLower = item.content.toLowerCase()
        const tagsLower = item.tags.map((t) => t.toLowerCase())

        for (const word of queryWords) {
            if (titleLower.includes(word)) score += 3
            if (contentLower.includes(word)) score += 1
            if (tagsLower.some((t) => t.includes(word))) score += 2
        }

        return { item, score }
    })

    return scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s) => s.item)
}
