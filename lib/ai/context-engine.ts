import { createClient } from '@/lib/supabase/server'
import { generateEmbedding, generateCompletion } from './providers'
import type { KnowledgeItem } from '@/types'

export type Intent = 'query' | 'transform' | 'time_filtered_query'

interface ContextResult {
    intent: Intent
    notes: KnowledgeItem[]
    timeRange?: { start: Date; end: Date }
}

/**
 * MCP-style Context Engine
 * Routes user intent to appropriate context and retrieves relevant notes
 */
export class ContextEngine {
    /**
     * Detect user intent from message
     */
    static detectIntent(message: string, hasActiveNote: boolean): Intent {
        const lowerMessage = message.toLowerCase()

        // Transform intents (need active note)
        const transformKeywords = ['summarize', 'rewrite', 'improve', 'shorten', 'expand', 'translate']
        if (hasActiveNote && transformKeywords.some(k => lowerMessage.includes(k))) {
            return 'transform'
        }

        // Time-filtered queries
        const timeKeywords = ['today', 'yesterday', 'this week', 'last week', 'this month', 'recent']
        if (timeKeywords.some(k => lowerMessage.includes(k))) {
            return 'time_filtered_query'
        }

        // Default to query
        return 'query'
    }

    /**
     * Parse time range from message
     */
    static parseTimeRange(message: string): { start: Date; end: Date } | undefined {
        const now = new Date()
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes('today')) {
            const start = new Date(now.setHours(0, 0, 0, 0))
            const end = new Date()
            return { start, end }
        }

        if (lowerMessage.includes('yesterday')) {
            const yesterday = new Date(now)
            yesterday.setDate(yesterday.getDate() - 1)
            const start = new Date(yesterday.setHours(0, 0, 0, 0))
            const end = new Date(yesterday.setHours(23, 59, 59, 999))
            return { start, end }
        }

        if (lowerMessage.includes('this week') || lowerMessage.includes('last week')) {
            const daysBack = lowerMessage.includes('last week') ? 14 : 7
            const start = new Date(now)
            start.setDate(start.getDate() - daysBack)
            return { start, end: new Date() }
        }

        if (lowerMessage.includes('this month') || lowerMessage.includes('recent')) {
            const start = new Date(now)
            start.setDate(start.getDate() - 30)
            return { start, end: new Date() }
        }

        return undefined
    }

    /**
     * Get context for user message
     */
    static async getContext(
        message: string,
        userId: string,
        activeNote?: KnowledgeItem
    ): Promise<ContextResult> {
        const intent = this.detectIntent(message, !!activeNote)

        // Transform: use only the active note
        if (intent === 'transform' && activeNote) {
            return { intent, notes: [activeNote] }
        }

        // Time-filtered query
        if (intent === 'time_filtered_query') {
            const timeRange = this.parseTimeRange(message)
            const notes = await this.getNotesInTimeRange(userId, timeRange!)
            return { intent, notes, timeRange }
        }

        // Regular query: semantic search
        const notes = await this.semanticSearch(message, userId)
        return { intent, notes }
    }

    /**
     * Semantic search using vector similarity
     */
    static async semanticSearch(query: string, userId: string, limit = 5): Promise<KnowledgeItem[]> {
        const supabase = await createClient()
        const embedding = await generateEmbedding(query)

        const { data, error } = await supabase.rpc('match_knowledge_items', {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: limit,
            p_user_id: userId,
        })

        if (error) {
            console.error('Semantic search error:', error)
            return []
        }

        return data || []
    }

    /**
     * Get notes within time range
     */
    static async getNotesInTimeRange(
        userId: string,
        timeRange: { start: Date; end: Date },
        limit = 10
    ): Promise<KnowledgeItem[]> {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('knowledge_items')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', timeRange.start.toISOString())
            .lte('created_at', timeRange.end.toISOString())
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Time range query error:', error)
            return []
        }

        return data || []
    }
}
