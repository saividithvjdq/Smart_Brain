import { generateCompletion } from './providers'
import { searchKnowledgeItems } from '@/lib/firebase/firestore'
import type { KnowledgeItem } from '@/types'

export type Intent = 'query' | 'transform' | 'time_filtered_query' | 'create' | 'search'

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

        // Create intents
        const createKeywords = ['save', 'capture', 'remember', 'store', 'add note']
        if (createKeywords.some(k => lowerMessage.includes(k))) {
            return 'create'
        }

        // Search intents
        const searchKeywords = ['find', 'search', 'look for', 'where is']
        if (searchKeywords.some(k => lowerMessage.includes(k))) {
            return 'search'
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
            const start = new Date(now)
            start.setHours(0, 0, 0, 0)
            return { start, end: new Date() }
        }

        if (lowerMessage.includes('yesterday')) {
            const yesterday = new Date(now)
            yesterday.setDate(yesterday.getDate() - 1)
            const start = new Date(yesterday)
            start.setHours(0, 0, 0, 0)
            const end = new Date(yesterday)
            end.setHours(23, 59, 59, 999)
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
     * Get context for user message — MCP routing
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
            if (timeRange) {
                const notes = await this.getNotesInTimeRange(userId, timeRange)
                return { intent, notes, timeRange }
            }
        }

        // Search / query: use keyword search
        const notes = await searchKnowledgeItems(userId, message, 5)
        return { intent, notes }
    }

    /**
     * Get notes within time range
     */
    static async getNotesInTimeRange(
        userId: string,
        timeRange: { start: Date; end: Date },
        limit = 10
    ): Promise<KnowledgeItem[]> {
        // Get all items and filter by date range
        const { items } = await import('@/lib/firebase/firestore').then(m =>
            m.getKnowledgeItems(userId, { limit: 100 })
        )

        return items
            .filter((item) => {
                const createdAt = new Date(item.created_at)
                return createdAt >= timeRange.start && createdAt <= timeRange.end
            })
            .slice(0, limit)
    }
}
