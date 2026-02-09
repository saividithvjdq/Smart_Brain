import { NextRequest, NextResponse } from 'next/server'
import { createKnowledgeItemSchema } from '@/lib/validations'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/ai/providers'
import { RAG } from '@/lib/ai/rag'

// GET /api/knowledge - List all knowledge items
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const tags = searchParams.get('tags')?.split(',').filter(Boolean)
        const search = searchParams.get('search')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        let query = supabase
            .from('knowledge_items')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (type) {
            query = query.eq('type', type)
        }

        if (tags && tags.length > 0) {
            query = query.contains('tags', tags)
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json({ error: 'Failed to fetch knowledge items' }, { status: 500 })
        }

        return NextResponse.json({ items: data, count: data?.length || 0 })
    } catch (error) {
        console.error('GET /api/knowledge error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/knowledge - Create new knowledge item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validation = createKnowledgeItemSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.flatten() },
                { status: 400 }
            )
        }

        const { title, content, type, source_url, tags } = validation.data

        const supabase = await createClient()

        // Create initial record (optimistic - return early)
        const { data: item, error: insertError } = await supabase
            .from('knowledge_items')
            .insert({
                title,
                content,
                type,
                source_url: source_url || null,
                tags: tags || [],
                // user_id will be set by RLS default if auth is configured
            })
            .select()
            .single()

        if (insertError) {
            console.error('Insert error:', insertError)
            return NextResponse.json({ error: 'Failed to create knowledge item' }, { status: 500 })
        }

        // Return 202 Accepted - AI processing will happen async
        // In a production app, this would trigger a background job
        // For demo purposes, we'll do light processing here

        // Generate summary and embedding in background (fire and forget for demo)
        processItemAsync(item.id, content, title, supabase)

        return NextResponse.json(
            { message: 'Knowledge item created', item },
            { status: 202 }
        )
    } catch (error) {
        console.error('POST /api/knowledge error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Background processing (in production, use a proper queue)
async function processItemAsync(
    itemId: string,
    content: string,
    title: string,
    supabase: Awaited<ReturnType<typeof createClient>>
) {
    try {
        // Generate summary
        const summary = await RAG.summarize(content)

        // Generate embedding
        const embedding = await generateEmbedding(`${title}\n\n${content}`)

        // Update the record
        await supabase
            .from('knowledge_items')
            .update({ summary, embedding })
            .eq('id', itemId)

        console.log(`Processed item ${itemId}: summary and embedding generated`)
    } catch (error) {
        console.error(`Failed to process item ${itemId}:`, error)
    }
}
