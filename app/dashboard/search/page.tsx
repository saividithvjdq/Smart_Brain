'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    FileText,
    Link2,
    Lightbulb,
    X,
    Loader2,
    SlidersHorizontal,
    Calendar,
    ArrowUpRight,
    Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1] as const

interface KnowledgeItem {
    id: string
    title: string
    content: string
    type: 'note' | 'link' | 'insight'
    tags: string[]
    summary?: string
    source_url?: string
    created_at: string
}

const typeConfig = {
    note: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Note', gradient: 'from-blue-500/20 to-blue-600/5' },
    link: { icon: Link2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Link', gradient: 'from-emerald-500/20 to-emerald-600/5' },
    insight: { icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Insight', gradient: 'from-amber-500/20 to-amber-600/5' },
}

const typeFilters = [
    { id: 'all', label: 'All Types' },
    { id: 'note', label: 'Notes' },
    { id: 'link', label: 'Links' },
    { id: 'insight', label: 'Insights' },
]

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [items, setItems] = useState<KnowledgeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [searchFocused, setSearchFocused] = useState(false)
    const [typeFilter, setTypeFilter] = useState('all')
    const [tagFilters, setTagFilters] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest')

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/knowledge')
            if (res.ok) {
                const data = await res.json()
                setItems(data)
            }
        } catch {
            console.error('Failed to fetch items')
        } finally {
            setLoading(false)
        }
    }

    const allTags = [...new Set(items.flatMap((item) => item.tags || []))]

    const toggleTagFilter = (tag: string) => {
        setTagFilters((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    const filteredItems = items
        .filter((item) => {
            if (typeFilter !== 'all' && item.type !== typeFilter) return false
            if (tagFilters.length > 0 && !tagFilters.some((t) => item.tags?.includes(t))) return false
            if (query) {
                const q = query.toLowerCase()
                return (
                    item.title.toLowerCase().includes(q) ||
                    item.content.toLowerCase().includes(q) ||
                    item.tags?.some((t) => t.toLowerCase().includes(q))
                )
            }
            return true
        })
        .sort((a, b) => {
            if (sortBy === 'latest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })

    return (
        <div className="space-y-6 relative">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
            >
                <h1 className="text-3xl font-bold mb-1">Search Knowledge</h1>
                <p className="text-muted-foreground text-sm">
                    Search across {items.length} items in your knowledge base
                </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
                className="relative"
            >
                <div className={cn(
                    "relative rounded-xl transition-all duration-300",
                    searchFocused && "ring-2 ring-primary/20"
                )}>
                    <Search className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors",
                        searchFocused ? "text-primary" : "text-muted-foreground"
                    )} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Search notes, links, insights..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-primary/40 outline-none text-sm placeholder:text-muted-foreground/50 transition-all"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/[0.06] transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease }}
                className="space-y-3"
            >
                {/* Type Filter */}
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                    <div className="flex gap-1.5">
                        {typeFilters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setTypeFilter(filter.id)}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                    typeFilter === filter.id
                                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/15'
                                        : 'bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/[0.12]'
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <button
                        onClick={() => setSortBy(sortBy === 'latest' ? 'oldest' : 'latest')}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.06] text-muted-foreground hover:text-white transition-all"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        {sortBy === 'latest' ? 'Newest first' : 'Oldest first'}
                    </button>
                </div>

                {/* Tag Filters */}
                {allTags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                        {allTags.slice(0, 12).map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTagFilter(tag)}
                                className={cn(
                                    'px-2.5 py-1 rounded-md text-xs transition-all',
                                    tagFilters.includes(tag)
                                        ? 'bg-primary/15 text-primary border border-primary/30'
                                        : 'bg-white/[0.02] border border-white/[0.06] text-muted-foreground hover:border-white/[0.12]'
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                        {tagFilters.length > 0 && (
                            <button
                                onClick={() => setTagFilters([])}
                                className="px-2.5 py-1 rounded-md text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Results */}
            <div className="space-y-3">
                {loading ? (
                    /* Loading State */
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-5 border-white/[0.06]">
                                <div className="animate-pulse space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
                                        <div className="flex-1">
                                            <div className="h-4 w-2/3 rounded bg-white/[0.06] mb-2" />
                                            <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                            <Search className="w-6 h-6 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">No results found</h3>
                        <p className="text-sm text-muted-foreground">
                            {query ? `No items match "${query}"` : 'Your knowledge base is empty. Start capturing knowledge.'}
                        </p>
                    </motion.div>
                ) : (
                    /* Results List */
                    <AnimatePresence>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground font-medium">
                                {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
                            </p>
                        </div>
                        {filteredItems.map((item, index) => {
                            const config = typeConfig[item.type]
                            const Icon = config.icon

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4, ease }}
                                >
                                    <Card className="p-5 border-white/[0.06] hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        <div className="relative z-10 flex items-start gap-4">
                                            <div className={`p-2.5 rounded-xl border ${config.bg} shrink-0`}>
                                                <Icon className={`w-5 h-5 ${config.color}`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <Badge variant="secondary" className={`text-[10px] ${config.bg} ${config.color} border shrink-0`}>
                                                        {config.label}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {item.summary || item.content.slice(0, 150)}
                                                </p>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {item.tags?.slice(0, 4).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-muted-foreground"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    <span className="text-[11px] text-muted-foreground/50 ml-auto font-medium">
                                                        {new Date(item.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>

                                                {item.source_url && (
                                                    <a
                                                        href={item.source_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-2 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ArrowUpRight className="w-3 h-3" />
                                                        Visit source
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
