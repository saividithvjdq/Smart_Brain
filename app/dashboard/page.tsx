'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/firebase/auth-context'
import {
    FileText,
    Link2,
    Lightbulb,
    TrendingUp,
    Clock,
    Sparkles,
    ArrowUpRight,
    Search,
    MessageSquare,
    PlusCircle,
    Inbox
} from 'lucide-react'
import { AxonIcon } from '@/components/ui/icons'
import { GlowingEffect } from '@/components/ui/glowing-effect'

const ease = [0.16, 1, 0.3, 1] as const

interface Stats {
    total: number
    notes: number
    links: number
    insights: number
    tags: number
    recentCount: number
}

interface RecentItem {
    id: string
    title: string
    type: 'note' | 'link' | 'insight'
    tags: string[]
    summary?: string
    created_at: string
}

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

const typeConfig = {
    note: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Note' },
    link: { icon: Link2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Link' },
    insight: { icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Insight' },
}

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString()
}

export default function DashboardPage() {
    const { getIdToken } = useAuth()
    const [stats, setStats] = useState<Stats>({ total: 0, notes: 0, links: 0, insights: 0, tags: 0, recentCount: 0 })
    const [recentItems, setRecentItems] = useState<RecentItem[]>([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        try {
            const token = await getIdToken()
            if (!token) return

            const headers = { Authorization: `Bearer ${token}` }

            const [statsRes, itemsRes] = await Promise.all([
                fetch('/api/dashboard/stats', { headers }),
                fetch('/api/knowledge?limit=5', { headers }),
            ])

            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }

            if (itemsRes.ok) {
                const itemsData = await itemsRes.json()
                setRecentItems(itemsData.items || [])
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }, [getIdToken])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const statCards = [
        { label: 'Total Notes', value: stats.notes, icon: FileText, gradient: 'from-blue-500/20 to-blue-600/5', iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
        { label: 'Links Saved', value: stats.links, icon: Link2, gradient: 'from-emerald-500/20 to-emerald-600/5', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
        { label: 'Insights', value: stats.insights, icon: Lightbulb, gradient: 'from-amber-500/20 to-amber-600/5', iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
        { label: 'Total Tags', value: stats.tags, icon: Sparkles, gradient: 'from-violet-500/20 to-violet-600/5', iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400' },
    ]

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
                <h1 className="text-3xl font-bold font-heading mb-1">Welcome back</h1>
                <p className="text-muted-foreground">Here is an overview of your knowledge base activity.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.6, ease }}
                    >
                        <Card className="p-5 relative overflow-hidden border border-white/[0.06] bg-[#0B0914] group cursor-pointer transition-all">
                            <GlowingEffect blur={15} spread={20} glow={true} variant="purple" inactiveZone={0.6} proximity={70} />
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.iconBg} border border-white/[0.06]`}>
                                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                    </div>
                                    {stats.recentCount > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                                            <TrendingUp className="w-3 h-3" />
                                            <span className="font-medium">+{stats.recentCount} this week</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-3xl font-bold mb-1 group-hover:text-primary transition-colors">
                                    {loading ? (
                                        <div className="w-12 h-8 rounded bg-white/5 animate-pulse" />
                                    ) : (
                                        <AnimatedCounter target={stat.value} />
                                    )}
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
                        <h2 className="text-lg font-bold font-heading flex items-center gap-2">
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

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="p-5 border-white/[0.06]">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                                        <div className="flex-1 space-y-2">
                                            <div className="w-2/3 h-4 rounded bg-white/5 animate-pulse" />
                                            <div className="w-full h-3 rounded bg-white/5 animate-pulse" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : recentItems.length === 0 ? (
                        <Card className="p-12 border-white/[0.06] text-center">
                            <Inbox className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="font-semibold mb-2">No knowledge items yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Start capturing your thoughts, links, and insights.</p>
                            <Link
                                href="/dashboard/capture"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Capture your first thought
                            </Link>
                        </Card>
                    ) : (
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
                                        <Card className="p-5 border-white/[0.06] bg-[#0B0914] transition-all cursor-pointer group relative overflow-hidden">
                                            <GlowingEffect blur={10} spread={15} glow={true} variant="purple" inactiveZone={0.6} proximity={70} />
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
                                                    {item.summary && (
                                                        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                                                            {item.summary}
                                                        </p>
                                                    )}
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
                                                            {timeAgo(item.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
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

                            <Link href="/dashboard/chat" className="block">
                                <div className="relative mb-4">
                                    <div className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-muted-foreground/50 hover:border-primary/30 transition-all cursor-pointer">
                                        What did I learn about...
                                    </div>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary text-white">
                                        <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>

                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">Quick prompts</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Recent insights', 'Summarize notes', 'Key takeaways'].map((prompt) => (
                                        <Link
                                            key={prompt}
                                            href="/dashboard/chat"
                                            className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:text-primary transition-all"
                                        >
                                            {prompt}
                                        </Link>
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
                        <h3 className="font-bold text-sm mb-3">Overview</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Total items</span>
                                <span className="text-sm font-semibold">{stats.total}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.04]">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(stats.total * 2, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">Added this week</span>
                                <span className="text-sm font-semibold">{stats.recentCount}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.04]">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(stats.recentCount * 10, 100)}%` }}
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
