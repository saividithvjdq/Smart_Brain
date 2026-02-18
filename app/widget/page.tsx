'use client'

import { useState } from 'react'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { AxonIcon } from '@/components/ui/icons'

export default function WidgetPage() {
    const [query, setQuery] = useState('')
    const [answer, setAnswer] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sources, setSources] = useState<Array<{ title: string; type: string }>>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim() || isLoading) return

        setIsLoading(true)
        setAnswer('')
        setSources([])

        try {
            const response = await fetch(`/api/public/brain/query?q=${encodeURIComponent(query)}`)
            const data = await response.json()

            if (data.error) {
                setAnswer(data.error)
            } else {
                setAnswer(data.answer)
                setSources(data.sources || [])
            }
        } catch {
            setAnswer('Failed to query. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#030014] text-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <AxonIcon size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-sm">Axon Knowledge</h1>
                    <p className="text-[11px] text-white/40">AI-Powered Query Widget</p>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto mb-4">
                {answer ? (
                    <div className="space-y-3">
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{answer}</p>
                        </div>

                        {sources.length > 0 && (
                            <div>
                                <p className="text-[11px] text-white/30 mb-1.5 font-medium">Sources</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {sources.map((source, i) => (
                                        <span
                                            key={i}
                                            className="text-[11px] px-2 py-1 bg-white/[0.04] rounded-md border border-white/[0.06] text-white/60"
                                        >
                                            {source.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-center">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-sm text-white/50 font-medium">
                                Ask a question to search the knowledge base
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 placeholder:text-white/30 transition-all"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                </button>
            </form>
        </div>
    )
}
