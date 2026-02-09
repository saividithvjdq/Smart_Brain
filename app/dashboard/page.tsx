'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Zap,
    FileText,
    Link2,
    Lightbulb,
    TrendingUp,
    Clock,
    Sparkles,
    ArrowUpRight,
    Brain
} from 'lucide-react'

// Smooth easing
const ease = [0.16, 1, 0.3, 1]

// Mock data for dashboard
const mockStats = [
    { label: 'Total Notes', value: '47', icon: FileText, change: '+12', trend: 'up' },
    { label: 'Links Saved', value: '23', icon: Link2, change: '+5', trend: 'up' },
    { label: 'Insights', value: '15', icon: Lightbulb, change: '+3', trend: 'up' },
    { label: 'AI Queries', value: '89', icon: Sparkles, change: '+28', trend: 'up' },
]

const mockRecentItems = [
    {
        id: '1',
        title: 'Understanding React Server Components',
        type: 'note',
        tags: ['react', 'nextjs', 'frontend'],
        summary: 'Key insights about RSCs and when to use them over client components...',
        createdAt: '2 hours ago',
    },
    {
        id: '2',
        title: 'Linear App Design Patterns',
        type: 'link',
        tags: ['design', 'ui', 'inspiration'],
        summary: 'Beautiful micro-interactions and motion design patterns from Linear...',
        createdAt: '5 hours ago',
    },
    {
        id: '3',
        title: 'AI Agents Architecture',
        type: 'insight',
        tags: ['ai', 'architecture', 'mcp'],
        summary: 'How context engines and RAG work together for intelligent querying...',
        createdAt: '1 day ago',
    },
]

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

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
            >
                <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
                <p className="text-muted-foreground">Here's what's happening with your knowledge base.</p>
            </motion.div>

            {/* Stats Grid - Scalepro Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockStats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6, ease }}
                    >
                        <Card className="p-6 glass-card gradient-border hover:lime-glow transition-all cursor-pointer group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                                    <stat.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1 group-hover:text-primary transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Items - Takes 2 columns */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            Recent Knowledge
                        </h2>
                        <Link
                            href="/dashboard/search"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            View all
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {mockRecentItems.map((item, index) => {
                            const Icon = typeIcons[item.type as keyof typeof typeIcons]
                            const colorClass = typeColors[item.type as keyof typeof typeColors]

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease }}
                                >
                                    <Card className="p-5 glass-card gradient-border hover:border-primary/30 transition-all cursor-pointer group">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2.5 rounded-xl border ${colorClass}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                                                    {item.summary}
                                                </p>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {item.tags.slice(0, 3).map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className="text-xs bg-secondary border border-border"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    <span className="text-xs text-muted-foreground ml-auto">
                                                        {item.createdAt}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Quick AI Ask - Sidebar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease }}
                    className="space-y-4"
                >
                    <Card className="p-6 glass-card gradient-border lime-glow">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                                <Brain className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Ask Axon</h3>
                                <p className="text-xs text-muted-foreground">Query your knowledge</p>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="What did I learn about..."
                                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder:text-muted-foreground"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                <Sparkles className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="text-xs text-muted-foreground">Quick prompts:</p>
                            <div className="flex flex-wrap gap-2">
                                {['Recent insights', 'React tips', 'AI patterns'].map((prompt) => (
                                    <button
                                        key={prompt}
                                        className="px-3 py-1.5 rounded-lg text-xs bg-secondary border border-border hover:border-primary/30 transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6 glass-card">
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            {[
                                { label: 'New Note', href: '/dashboard/capture', icon: FileText },
                                { label: 'Save Link', href: '/dashboard/capture', icon: Link2 },
                                { label: 'AI Chat', href: '/dashboard/chat', icon: Sparkles },
                            ].map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                >
                                    <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-sm">{action.label}</span>
                                    <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-foreground transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
