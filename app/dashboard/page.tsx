'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    Link2,
    Lightbulb,
    TrendingUp,
    Clock,
    Sparkles,
    ArrowUpRight,
    Brain,
    Search,
    MessageSquare
} from 'lucide-react'
import { AxonIcon } from '@/components/ui/icons'

const ease = [0.16, 1, 0.3, 1] as const

// Animated counter component
function AnimatedCounter({ target, duration = 1.5 }: { target: number; duration?: number }) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (v) => Math.round(v))
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const controls = animate(count, target, { duration, ease: "easeOut" })
        return controls.stop
    }, [count, target, duration])

    useEffect(() => {
        const unsubscribe = rounded.on("change", (v) => {
            if (ref.current) ref.current.textContent = String(v)
        })
        return unsubscribe
    }, [rounded])

    return <span ref={ref}>0</span>
}

// Stats with gradient accents
const stats = [
    { label: 'Total Notes', value: 47, icon: FileText, change: '+12 this week', gradient: 'from-blue-500/20 to-blue-600/5', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
    { label: 'Links Saved', value: 23, icon: Link2, change: '+5 this week', gradient: 'from-emerald-500/20 to-emerald-600/5', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
    { label: 'Insights', value: 15, icon: Lightbulb, change: '+3 this week', gradient: 'from-amber-500/20 to-amber-600/5', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'AI Queries', value: 89, icon: Sparkles, change: '+28 this week', gradient: 'from-violet-500/20 to-violet-600/5', iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400' },
]

const recentItems = [
    {
        id: '1',
        title: 'Understanding React Server Components',
        type: 'note' as const,
        tags: ['react', 'nextjs', 'frontend'],
        summary: 'Key insights about RSCs and when to use them over client components for optimal performance.',
        createdAt: '2 hours ago',
    },
    {
        id: '2',
        title: 'Linear App Design Patterns',
        type: 'link' as const,
        tags: ['design', 'ui', 'inspiration'],
        summary: 'Beautiful micro-interactions and motion design patterns from Linear app.',
        createdAt: '5 hours ago',
    },
    {
        id: '3',
        title: 'AI Agents Architecture',
        type: 'insight' as const,
        tags: ['ai', 'architecture', 'mcp'],
        summary: 'How context engines and RAG work together for intelligent querying.',
        createdAt: '1 day ago',
    },
]

const typeConfig = {
    note: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Note' },
    link: { icon: Link2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Link' },
    insight: { icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Insight' },
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 relative">
            {/* Background orbs */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="relative"
            >
                <h1 className="text-3xl font-bold mb-1">Welcome back</h1>
                <p className="text-muted-foreground">Here is an overview of your knowledge base activity.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.6, ease }}
                    >
                        <Card className="p-5 relative overflow-hidden border-white/[0.06] hover:border-white/[0.12] transition-all group cursor-pointer">
                            {/* Gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.iconBg} border border-white/[0.06]`}>
                                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="font-medium">{stat.change}</span>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1 group-hover:text-white transition-colors">
                                    <AnimatedCounter target={stat.value} />
                                </div>
                                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Items - 2 columns */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            Recent Knowledge
                        </h2>
                        <Link
                            href="/dashboard/search"
                            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium transition-colors"
                        >
                            View all
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {recentItems.map((item, index) => {
                            const config = typeConfig[item.type]
                            const Icon = config.icon

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease }}
                                >
                                    <Card className="p-5 border-white/[0.06] hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className={`p-2.5 rounded-xl border ${config.bg}`}>
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
                                                <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                                                    {item.summary}
                                                </p>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {item.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-muted-foreground"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    <span className="text-xs text-muted-foreground/60 ml-auto font-medium">
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

                {/* Sidebar Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease }}
                    className="space-y-4"
                >
                    {/* Ask Axon */}
                    <Card className="p-5 border-white/[0.06] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
                                    <AxonIcon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Ask Axon</h3>
                                    <p className="text-xs text-muted-foreground">Query your knowledge</p>
                                </div>
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="What did I learn about..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none text-sm placeholder:text-muted-foreground/50 transition-all"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">Quick prompts</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Recent insights', 'React tips', 'AI patterns'].map((prompt) => (
                                        <button
                                            key={prompt}
                                            className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:text-primary transition-all"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-5 border-white/[0.06]">
                        <h3 className="font-bold text-sm mb-4">Quick Actions</h3>
                        <div className="space-y-1">
                            {[
                                { label: 'New Note', href: '/dashboard/capture', icon: FileText, desc: 'Capture a thought' },
                                { label: 'Save Link', href: '/dashboard/capture', icon: Link2, desc: 'Bookmark a resource' },
                                { label: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare, desc: 'Ask your brain' },
                                { label: 'Search', href: '/dashboard/search', icon: Search, desc: 'Find knowledge' },
                            ].map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
                                >
                                    <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium group-hover:text-white transition-colors">{action.label}</span>
                                        <p className="text-[11px] text-muted-foreground/60">{action.desc}</p>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </Card>

                    {/* Activity Summary */}
                    <Card className="p-5 border-white/[0.06]">
                        <h3 className="font-bold text-sm mb-3">This Week</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Notes created</span>
                                <span className="text-sm font-semibold">12</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.04]">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                    initial={{ width: 0 }}
                                    animate={{ width: '72%' }}
                                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">AI interactions</span>
                                <span className="text-sm font-semibold">28</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.04]">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
