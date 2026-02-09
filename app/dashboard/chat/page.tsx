'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Send,
    Loader2,
    Brain,
    User,
    Sparkles,
    ArrowUpRight,
    MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1]

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    sources?: Array<{ id: string; title: string; type: string }>
}

const suggestions = [
    'What did I learn about React?',
    'Summarize my AI notes',
    'Find insights about design',
]

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/ai/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: input }),
            })
            const data = await res.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer || 'I couldn\'t find an answer to that.',
                sources: data.sources,
            }
            setMessages((prev) => [...prev, assistantMessage])
        } catch {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Something went wrong. Please try again.',
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuggestion = (suggestion: string) => {
        setInput(suggestion)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
                        <Brain className="w-6 h-6 text-primary" />
                    </div>
                    Ask Axon
                </h1>
                <p className="text-muted-foreground mt-1">Query your knowledge base with natural language</p>
            </motion.div>

            {/* Messages */}
            <Card className="flex-1 p-6 glass-card overflow-hidden flex flex-col">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center max-w-md"
                        >
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                                <MessageSquare className="w-10 h-10 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
                            <p className="text-muted-foreground mb-6">
                                Ask questions about anything in your knowledge base. Axon will search and synthesize an answer.
                            </p>

                            <div className="flex flex-wrap gap-2 justify-center">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSuggestion(suggestion)}
                                        className="px-4 py-2 rounded-xl text-sm border border-border glass-subtle hover:border-primary/30 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.4, ease }}
                                className={cn(
                                    'flex gap-4',
                                    message.role === 'user' && 'justify-end'
                                )}
                            >
                                {message.role === 'assistant' && (
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>
                                )}

                                <div className={cn(
                                    'max-w-[80%] rounded-2xl p-4',
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'glass-subtle border border-border'
                                )}>
                                    <p className="whitespace-pre-wrap">{message.content}</p>

                                    {message.sources && message.sources.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-xs text-muted-foreground mb-2">Sources</p>
                                            <div className="flex flex-wrap gap-2">
                                                {message.sources.map((source) => (
                                                    <Badge
                                                        key={source.id}
                                                        variant="secondary"
                                                        className="text-xs bg-black/30 border border-border"
                                                    >
                                                        {source.title}
                                                        <ArrowUpRight className="w-3 h-3 ml-1" />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {message.role === 'user' && (
                                    <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                </div>
                                <div className="glass-subtle border border-border rounded-2xl p-4">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-border">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about your knowledge..."
                            className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}
