import { NextRequest, NextResponse } from 'next/server'
import { queryBrainSchema } from '@/lib/validations'
import { RAG } from '@/lib/ai/rag'

// Rate limiter (simple in-memory)
const requestCounts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

function getRateLimitHeaders(remaining: number, resetAt: number) {
    return {
        'X-RateLimit-Limit': RATE_LIMIT.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(resetAt / 1000).toString(),
    }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const record = requestCounts.get(ip)

    if (!record || now > record.resetAt) {
        const resetAt = now + RATE_WINDOW
        requestCounts.set(ip, { count: 1, resetAt })
        return { allowed: true, remaining: RATE_LIMIT - 1, resetAt }
    }

    if (record.count >= RATE_LIMIT) {
        return { allowed: false, remaining: 0, resetAt: record.resetAt }
    }

    record.count++
    return { allowed: true, remaining: RATE_LIMIT - record.count, resetAt: record.resetAt }
}

// GET /api/public/brain/query - Public API endpoint
export async function GET(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown'
        const { allowed, remaining, resetAt } = checkRateLimit(ip)

        if (!allowed) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429, headers: getRateLimitHeaders(remaining, resetAt) }
            )
        }

        const { searchParams } = new URL(request.url)
        const question = searchParams.get('q')

        if (!question) {
            return NextResponse.json(
                {
                    error: 'Missing query parameter',
                    usage: 'GET /api/public/brain/query?q=your question here',
                },
                { status: 400, headers: getRateLimitHeaders(remaining, resetAt) }
            )
        }

        const validation = queryBrainSchema.safeParse({ question })
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid query', details: validation.error.flatten() },
                { status: 400, headers: getRateLimitHeaders(remaining, resetAt) }
            )
        }

        const userId = 'public-demo'
        const result = await RAG.query(question, userId)

        return NextResponse.json(
            {
                answer: result.answer,
                sources: result.sources.map(s => ({
                    id: s.id,
                    title: s.title,
                    type: s.type,
                    summary: s.summary?.slice(0, 200),
                })),
                meta: {
                    query: question,
                    timestamp: new Date().toISOString(),
                    source_count: result.sources.length,
                },
            },
            { headers: getRateLimitHeaders(remaining, resetAt) }
        )
    } catch (error) {
        console.error('Public query error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
