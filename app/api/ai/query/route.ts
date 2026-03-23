import { NextRequest, NextResponse } from 'next/server'
import { queryBrainSchema } from '@/lib/validations'
import { verifyAuth } from '@/lib/firebase/auth-helpers'
import { RAG } from '@/lib/ai/rag'
import { callBackend } from '@/lib/api/backend'

// POST /api/ai/query - Query the knowledge base with RAG
// Tries Python backend first (for vector search), falls back to local RAG
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

        // Try Python backend first (has vector search + user context)
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const backendResult = await callBackend<{ answer: string; sources: Array<{ id: string; title: string; type: string; summary: string }> }>(
            '/ai/query',
            {
                method: 'POST',
                body: { question },
                token: token || undefined,
            }
        )

        if (backendResult.success && backendResult.data) {
            return NextResponse.json({
                answer: backendResult.data.answer,
                sources: backendResult.data.sources,
                engine: 'python-rag',
            })
        }

        // Fallback to local RAG (Next.js)
        const result = await RAG.query(question, userId)

        return NextResponse.json({
            answer: result.answer,
            sources: result.sources.map(s => ({
                id: s.id,
                title: s.title,
                type: s.type,
                summary: s.summary,
            })),
            engine: 'nextjs-rag',
        })
    } catch (error) {
        console.error('Query error:', error)
        return NextResponse.json({ error: 'Failed to query knowledge base' }, { status: 500 })
    }
}
