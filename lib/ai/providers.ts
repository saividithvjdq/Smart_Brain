import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Lazy-initialize clients to avoid build-time errors
let groqClient: Groq | null = null
let genAIClient: GoogleGenerativeAI | null = null

function getGroqClient(): Groq {
    if (!groqClient) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is not set')
        }
        groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })
    }
    return groqClient
}

function getGenAIClient(): GoogleGenerativeAI {
    if (!genAIClient) {
        if (!process.env.GOOGLE_AI_API_KEY) {
            throw new Error('GOOGLE_AI_API_KEY is not set')
        }
        genAIClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    }
    return genAIClient
}

export type AIProvider = 'groq' | 'gemini'

interface AICompletionOptions {
    provider?: AIProvider
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
}

/**
 * Generate AI completion using either Groq or Gemini
 * Groq is faster, Gemini has larger context window
 */
export async function generateCompletion(
    prompt: string,
    options: AICompletionOptions = {}
): Promise<string> {
    const {
        provider = 'groq',
        systemPrompt = 'You are a helpful assistant.',
        temperature = 0.7,
        maxTokens = 1024,
    } = options

    if (provider === 'groq') {
        const groq = getGroqClient()
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            temperature,
            max_tokens: maxTokens,
        })
        return completion.choices[0]?.message?.content || ''
    }

    // Gemini
    const genAI = getGenAIClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
        generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
        },
    })
    return result.response.text()
}

/**
 * Generate embeddings for semantic search
 * Using Gemini's embedding model (free)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const genAI = getGenAIClient()
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const result = await model.embedContent(text)
    return result.embedding.values
}

/**
 * Stream AI completion for real-time responses
 */
export async function* streamCompletion(
    prompt: string,
    options: AICompletionOptions = {}
): AsyncGenerator<string, void, unknown> {
    const {
        provider = 'groq',
        systemPrompt = 'You are a helpful assistant.',
        temperature = 0.7,
        maxTokens = 1024,
    } = options

    if (provider === 'groq') {
        const groq = getGroqClient()
        const stream = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            temperature,
            max_tokens: maxTokens,
            stream: true,
        })

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) yield content
        }
    } else {
        // Gemini streaming
        const genAI = getGenAIClient()
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContentStream({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
            generationConfig: {
                temperature,
                maxOutputTokens: maxTokens,
            },
        })

        for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) yield text
        }
    }
}
