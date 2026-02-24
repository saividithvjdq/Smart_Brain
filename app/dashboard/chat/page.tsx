'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/firebase/auth-context'
import {
    Send,
    Loader2,
    User,
    Sparkles,
    ArrowUpRight,
    Copy,
    Check
} from 'lucide-react'
import { AxonIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1] as const

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
    const { getIdToken } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)
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
            content: input.trim(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const token = await getIdToken()
            const res = await fetch('/api/ai/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ question: userMessage.content }),
            })

            const data = await res.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer || 'I could not find a relevant answer in your knowledge base.',
                sources: data.sources || [],
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.',
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuggestion = (suggestion: string) => {
        setInput(suggestion)
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] relative">
            {/* Background effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 relative">
                {messages.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease }}
                        className="flex flex-col items-center justify-center h-full text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center mb-6"
                        >
                            <AxonIcon size={28} className="text-primary" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-2">Ask Your Knowledge Base</h2>
                        <p className="text-muted-foreground text-sm max-w-md mb-8">
                            Ask questions about your saved notes, links, and insights.
                            Axon will search your knowledge and provide sourced answers.
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSuggestion(suggestion)}
                                    className="px-4 py-2 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] hover:border-primary/30 hover:text-primary transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* Messages */
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease }}
                                className={cn(
                                    'flex gap-3 max-w-3xl',
                                    message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    'w-8 h-8 rounded-xl flex items-center justify-center shrink-0',
                                    message.role === 'user'
                                        ? 'bg-gradient-to-br from-primary to-accent'
                                        : 'bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20'
                                )}>
                                    {message.role === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <AxonIcon size={14} className="text-primary" />
                                    )}
                                </div>

                                {/* Message */}
                                <div className={cn(
                                    'flex-1 max-w-[85%]',
                                    message.role === 'user' ? 'text-right' : ''
                                )}>
                                    <div className={cn(
                                        'inline-block p-4 rounded-2xl text-sm leading-relaxed',
                                        message.role === 'user'
                                            ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-md'
                                            : 'bg-white/[0.04] border border-white/[0.06] rounded-tl-md'
                                    )}>
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>

                                    {/* Sources */}
                                    {message.sources && message.sources.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            <p className="text-[11px] text-muted-foreground font-medium">Sources</p>
                                            {message.sources.map((source) => (
                                                <Link
                                                    key={source.id}
                                                    href={`/dashboard/search?q=${source.title}`}
                                                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <ArrowUpRight className="w-3 h-3" />
                                                    <span>{source.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Copy button for assistant */}
                                    {message.role === 'assistant' && (
                                        <button
                                            onClick={() => copyToClipboard(message.content, message.id)}
                                            className="mt-1.5 p-1 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                                        >
                                            {copiedId === message.id ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 max-w-3xl"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0">
                            <AxonIcon size={14} className="text-primary" />
                        </div>
                        <div className="p-4 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.06]">
                            <div className="flex items-center gap-1.5">
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-primary"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                />
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-primary"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                />
                                <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-primary"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/[0.06] p-4 bg-card/50 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your knowledge base anything..."
                                disabled={isLoading}
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none text-sm placeholder:text-muted-foreground/50 transition-all disabled:opacity-50"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/25 px-4 py-3 h-auto transition-all"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground/40 mt-2 text-center">
                        Axon searches your notes and provides sourced answers
                    </p>
                </form>
            </div>
        </div>
    )
}
