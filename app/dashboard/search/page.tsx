'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    FileText,
    Link2,
    Lightbulb,
    Filter,
    X,
    ChevronDown,
    Loader2,
    SlidersHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1]

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

const typeIcons = {
    note: FileText,
    link: Link2,
    insight: Lightbulb,
}

const typeColors = {
    note: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    link: 'bg-green-500/20 text-green-400 border-green-500/30',
    insight: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function SearchPage() {
    const [items, setItems] = useState<KnowledgeItem[]>([])
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState<string | null>(null)
    const [tagFilter, setTagFilter] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchItems()
    }, [typeFilter, tagFilter])

    useEffect(() => {
        const timer = setTimeout(() => fetchItems(), 300)
        return () => clearTimeout(timer)
    }, [search])

    const fetchItems = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.set('search', search)
            if (typeFilter) params.set('type', typeFilter)
            if (tagFilter.length > 0) params.set('tags', tagFilter.join(','))

            const response = await fetch(`/api/knowledge?${params.toString()}`)
            const data = await response.json()
            setItems(data.items || [])
        } catch {
            console.error('Fetch error')
        } finally {
            setIsLoading(false)
        }
    }

    const allTags = Array.from(
        new Set(items.flatMap(item => item.tags || []))
    ).slice(0, 15)

    const toggleTagFilter = (tag: string) => {
        setTagFilter(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
            >
                <h1 className="text-3xl font-bold mb-2">Search</h1>
                <p className="text-muted-foreground">Find anything in your knowledge base.</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease }}
                className="space-y-4"
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search your knowledge..."
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-black/30 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center gap-4 flex-wrap">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all',
                            showFilters
                                ? 'border-primary/50 bg-primary/10 text-primary'
                                : 'border-border glass-subtle hover:border-white/20'
                        )}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        <ChevronDown className={cn(
                            'w-4 h-4 transition-transform',
                            showFilters && 'rotate-180'
                        )} />
                    </button>

                    {/* Active Filters */}
                    {(typeFilter || tagFilter.length > 0) && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {typeFilter && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/30">
                                    {typeFilter}
                                    <button onClick={() => setTypeFilter(null)} className="ml-2">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {tagFilter.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-secondary border border-border">
                                    {tag}
                                    <button onClick={() => toggleTagFilter(tag)} className="ml-2">
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                            <button
                                onClick={() => { setTypeFilter(null); setTagFilter([]) }}
                                className="text-xs text-muted-foreground hover:text-foreground ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="p-6 glass-card">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Type Filter */}
                                <div>
                                    <h4 className="text-sm font-medium mb-3">Type</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {(['note', 'link', 'insight'] as const).map((type) => {
                                            const Icon = typeIcons[type]
                                            return (
                                                <button
                                                    key={type}
                                                    onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                                                    className={cn(
                                                        'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all capitalize text-sm',
                                                        typeFilter === type
                                                            ? 'border-primary/50 bg-primary/10 text-primary'
                                                            : 'border-border hover:border-white/20'
                                                    )}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    {type}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Tags Filter */}
                                <div>
                                    <h4 className="text-sm font-medium mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTagFilter(tag)}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-lg text-xs border transition-all',
                                                    tagFilter.includes(tag)
                                                        ? 'border-primary/50 bg-primary/10 text-primary'
                                                        : 'border-border hover:border-white/20'
                                                )}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                        {allTags.length === 0 && (
                                            <span className="text-muted-foreground text-sm">No tags available</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </motion.div>

            {/* Results */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                Searching...
                            </span>
                        ) : (
                            `${items.length} result${items.length !== 1 ? 's' : ''}`
                        )}
                    </h2>
                </div>

                {items.length === 0 && !isLoading ? (
                    <Card className="p-16 glass-card text-center">
                        <Search className="w-14 h-14 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search or filters
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {items.map((item, index) => {
                            const Icon = typeIcons[item.type]
                            const colorClass = typeColors[item.type]

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4, ease }}
                                >
                                    <Card className="p-5 glass-card gradient-border hover:border-primary/30 transition-all cursor-pointer group">
                                        <div className="flex gap-4">
                                            <div className={cn('p-2.5 rounded-xl border shrink-0', colorClass)}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground shrink-0">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {item.summary || item.content.slice(0, 200)}
                                                </p>
                                                {item.tags && item.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="text-xs bg-secondary border border-border"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
