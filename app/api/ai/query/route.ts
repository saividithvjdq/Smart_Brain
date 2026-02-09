import { NextRequest, NextResponse } from 'next/server'
import { queryBrainSchema } from '@/lib/validations'
import { RAG } from '@/lib/ai/rag'

// POST /api/ai/query - Query the knowledge base with RAG
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validation = queryBrainSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { question } = validation.data

        // For demo, use a placeholder user ID
        // In production, get from auth session
        const userId = 'demo-user'

        const result = await RAG.query(question, userId)

        return NextResponse.json({
            answer: result.answer,
            sources: result.sources.map(s => ({
                id: s.id,
                title: s.title,
                type: s.type,
                summary: s.summary,
            })),
        })
    } catch (error) {
        console.error('Query error:', error)
        return NextResponse.json({ error: 'Failed to query knowledge base' }, { status: 500 })
    }
}
