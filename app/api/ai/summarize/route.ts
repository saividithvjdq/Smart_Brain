import { NextRequest, NextResponse } from 'next/server'
import { summarizeSchema } from '@/lib/validations'
import { RAG } from '@/lib/ai/rag'

// POST /api/ai/summarize - Generate summary for content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validation = summarizeSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { content } = validation.data

        const summary = await RAG.summarize(content)

        return NextResponse.json({ summary })
    } catch (error) {
        console.error('Summarize error:', error)
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
    }
}
