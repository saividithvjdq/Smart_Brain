import { generateCompletion, streamCompletion } from './providers'
import { ContextEngine } from './context-engine'
import type { KnowledgeItem } from '@/types'

interface RAGResponse {
    answer: string
    sources: KnowledgeItem[]
}

/**
 * RAG (Retrieval Augmented Generation) Layer
 * Combines semantic search with LLM generation for contextual answers
 */
export class RAG {
    private static readonly SYSTEM_PROMPT = `You are the user's Second Brain assistant. You help them recall and connect their knowledge.

RULES:
1. Answer ONLY using the provided notes as context
2. If the notes don't contain relevant information, say "I don't have notes about that"
3. Quote note titles as sources when referencing information
4. Be concise but thorough
5. Make connections between related notes when relevant`

    /**
     * Generate answer using retrieved context
     */
    static async query(
        question: string,
        userId: string,
        activeNote?: KnowledgeItem
    ): Promise<RAGResponse> {
        // Get relevant context
        const context = await ContextEngine.getContext(question, userId, activeNote)

        if (context.notes.length === 0) {
            return {
                answer: "I don't have any notes that could help answer this question. Try capturing some knowledge first!",
                sources: [],
            }
        }

        // Build context string
        const contextStr = this.buildContextString(context.notes)

        // Generate answer
        const prompt = `${this.SYSTEM_PROMPT}

CONTEXT (User's Notes):
${contextStr}

USER QUESTION: ${question}

Answer the question using ONLY the context above. Cite sources by title.`

        const answer = await generateCompletion(prompt, {
            provider: 'groq',
            temperature: 0.5,
            maxTokens: 1024,
        })

        return {
            answer,
            sources: context.notes,
        }
    }

    /**
     * Stream answer for real-time responses
     */
    static async *streamQuery(
        question: string,
        userId: string,
        activeNote?: KnowledgeItem
    ): AsyncGenerator<{ chunk?: string; sources?: KnowledgeItem[] }, void, unknown> {
        // Get relevant context
        const context = await ContextEngine.getContext(question, userId, activeNote)

        if (context.notes.length === 0) {
            yield {
                chunk: "I don't have any notes that could help answer this question.",
                sources: [],
            }
            return
        }

        // Yield sources first
        yield { sources: context.notes }

        // Build context string
        const contextStr = this.buildContextString(context.notes)

        // Stream answer
        const prompt = `${this.SYSTEM_PROMPT}

CONTEXT (User's Notes):
${contextStr}

USER QUESTION: ${question}

Answer the question using ONLY the context above. Cite sources by title.`

        for await (const chunk of streamCompletion(prompt, {
            provider: 'groq',
            temperature: 0.5,
            maxTokens: 1024,
        })) {
            yield { chunk }
        }
    }

    /**
     * Build context string from notes
     */
    private static buildContextString(notes: KnowledgeItem[]): string {
        return notes
            .map((note, i) => {
                const summary = note.summary || note.content.slice(0, 500)
                const tags = note.tags?.length ? `[Tags: ${note.tags.join(', ')}]` : ''
                return `--- Note ${i + 1}: "${note.title}" ${tags} ---
${summary}
`
            })
            .join('\n')
    }

    /**
     * Summarize a single note
     */
    static async summarize(content: string): Promise<string> {
        const prompt = `Summarize the following content in 2-3 concise sentences. Focus on key insights and actionable points.

CONTENT:
${content}

SUMMARY:`

        return generateCompletion(prompt, {
            provider: 'groq',
            temperature: 0.3,
            maxTokens: 256,
        })
    }

    /**
     * Generate tags for content
     */
    static async generateTags(title: string, content: string): Promise<string[]> {
        const prompt = `Generate 3-5 relevant tags for this knowledge item. Return ONLY a JSON array of lowercase tags.

TITLE: ${title}

CONTENT: ${content.slice(0, 1000)}

TAGS (JSON array only, no other text):`

        const response = await generateCompletion(prompt, {
            provider: 'groq',
            temperature: 0.3,
            maxTokens: 100,
        })

        try {
            // Extract JSON array from response
            const match = response.match(/\[.*\]/)
            if (match) {
                return JSON.parse(match[0])
            }
        } catch {
            console.error('Failed to parse tags:', response)
        }

        return []
    }
}
