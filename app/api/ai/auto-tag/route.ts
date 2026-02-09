import { NextRequest, NextResponse } from 'next/server'
import { autoTagSchema } from '@/lib/validations'
import { RAG } from '@/lib/ai/rag'

// POST /api/ai/auto-tag - Generate tags for content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validation = autoTagSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { title, content } = validation.data

        const tags = await RAG.generateTags(title || '', content)

        return NextResponse.json({ tags })
    } catch (error) {
        console.error('Auto-tag error:', error)
        return NextResponse.json({ error: 'Failed to generate tags' }, { status: 500 })
    }
}
