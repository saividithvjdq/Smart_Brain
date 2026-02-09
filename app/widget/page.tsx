'use client'

import { useState } from 'react'
import { Brain, Sparkles, Send, Loader2 } from 'lucide-react'

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
        } catch (error) {
            setAnswer('Failed to query. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="font-semibold">Second Brain</h1>
                    <p className="text-xs text-white/60">Knowledge Query Widget</p>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto mb-4">
                {answer ? (
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-sm whitespace-pre-wrap">{answer}</p>
                        </div>

                        {sources.length > 0 && (
                            <div>
                                <p className="text-xs text-white/40 mb-2">Sources</p>
                                <div className="flex flex-wrap gap-2">
                                    {sources.map((source, i) => (
                                        <span
                                            key={i}
                                            className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10"
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
                            <Sparkles className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                            <p className="text-sm text-white/60">
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
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-indigo-500/50"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg disabled:opacity-50"
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
