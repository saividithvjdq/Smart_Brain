export interface KnowledgeItem {
    id: string
    user_id: string
    title: string
    content: string
    type: 'note' | 'link' | 'insight'
    source_url?: string
    tags: string[]
    summary?: string
    embedding?: number[]
    created_at: string
    updated_at: string
}

export interface CreateKnowledgeItem {
    title: string
    content: string
    type: 'note' | 'link' | 'insight'
    source_url?: string
    tags?: string[]
}

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    sources?: KnowledgeItem[]
    created_at: string
}

export interface ChatSession {
    id: string
    user_id: string
    messages: ChatMessage[]
    created_at: string
    updated_at: string
}
