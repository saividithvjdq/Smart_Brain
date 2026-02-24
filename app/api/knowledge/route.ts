import { NextRequest, NextResponse } from 'next/server'
import { createKnowledgeItemSchema } from '@/lib/validations'
import { verifyAuth } from '@/lib/firebase/auth-helpers'
import {
    createKnowledgeItem,
    getKnowledgeItems,
    deleteKnowledgeItem,
} from '@/lib/firebase/firestore'
import { RAG } from '@/lib/ai/rag'

// GET /api/knowledge - List all knowledge items
export async function GET(request: NextRequest) {
    try {
        const userId = await verifyAuth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || undefined
        const tags = searchParams.get('tags')?.split(',').filter(Boolean)
        const search = searchParams.get('search') || undefined
        const limit = parseInt(searchParams.get('limit') || '50')

        const { items, count } = await getKnowledgeItems(userId, {
            type,
            tags,
            search,
            limit,
        })

        // Strip sensitive data from response
        const safeItems = items.map(({ embedding, ...item }) => item)

        return NextResponse.json({ items: safeItems, count })
    } catch (error) {
        console.error('GET /api/knowledge error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/knowledge - Create new knowledge item
export async function POST(request: NextRequest) {
    try {
        const userId = await verifyAuth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Validate input
        const validation = createKnowledgeItemSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const item = await createKnowledgeItem(userId, validation.data)

        // Generate summary in background (fire and forget)
        processItemAsync(item.id, item.content, item.title)

        return NextResponse.json(
            { message: 'Knowledge item created', item },
            { status: 202 }
        )
    } catch (error) {
        console.error('POST /api/knowledge error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/knowledge - Delete a knowledge item
export async function DELETE(request: NextRequest) {
    try {
        const userId = await verifyAuth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const itemId = searchParams.get('id')
        if (!itemId) {
            return NextResponse.json({ error: 'Missing item id' }, { status: 400 })
        }

        const deleted = await deleteKnowledgeItem(userId, itemId)
        if (!deleted) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Item deleted' })
    } catch (error) {
        console.error('DELETE /api/knowledge error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Background processing
async function processItemAsync(itemId: string, content: string, title: string) {
    try {
        const summary = await RAG.summarize(content)
        const { updateKnowledgeItem } = await import('@/lib/firebase/firestore')
        await updateKnowledgeItem(itemId, { summary })
        console.log(`Processed item ${itemId}: summary generated`)
    } catch (error) {
        console.error(`Failed to process item ${itemId}:`, error)
    }
}
