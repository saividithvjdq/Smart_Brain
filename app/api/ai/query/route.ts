import { NextRequest, NextResponse } from 'next/server'
import { queryBrainSchema } from '@/lib/validations'
import { verifyAuth } from '@/lib/firebase/auth-helpers'
import { RAG } from '@/lib/ai/rag'

// POST /api/ai/query - Query the knowledge base with RAG
export async function POST(request: NextRequest) {
    try {
        const userId = await verifyAuth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const validation = queryBrainSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { question } = validation.data

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
