import { z } from 'zod'

export const createKnowledgeItemSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    content: z.string().min(1, 'Content is required').max(50000),
    type: z.enum(['note', 'link', 'insight']),
    source_url: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string()).optional().default([]),
})

export const updateKnowledgeItemSchema = createKnowledgeItemSchema.partial()

export const queryBrainSchema = z.object({
    question: z.string().min(1, 'Question is required').max(1000),
})

export const autoTagSchema = z.object({
    title: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
})

export const summarizeSchema = z.object({
    content: z.string().min(1, 'Content is required').max(50000),
})

export type CreateKnowledgeItem = z.infer<typeof createKnowledgeItemSchema>
export type UpdateKnowledgeItem = z.infer<typeof updateKnowledgeItemSchema>
export type QueryBrain = z.infer<typeof queryBrainSchema>
export type AutoTag = z.infer<typeof autoTagSchema>
export type Summarize = z.infer<typeof summarizeSchema>
