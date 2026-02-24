'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AxonIcon } from '@/components/ui/icons'
import { useAuth } from '@/lib/firebase/auth-context'
import {
    LayoutDashboard,
    PlusCircle,
    Search,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    User,
    Check
} from 'lucide-react'

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/capture', label: 'Capture', icon: PlusCircle },
    { href: '/dashboard/search', label: 'Search', icon: Search },
    { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
]

const bottomItems = [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

function getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
}

function getPageTitle(pathname: string): string {
    if (pathname === '/dashboard') return 'Overview'
    if (pathname.includes('/capture')) return 'Capture'
    if (pathname.includes('/search')) return 'Search'
    if (pathname.includes('/chat')) return 'AI Chat'
    if (pathname.includes('/settings')) return 'Settings'
    return 'Dashboard'
}

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, signOut } = useAuth()
    const [collapsed, setCollapsed] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'
    const userName = user?.displayName || user?.email?.split('@')[0] || 'User'
    const userEmail = user?.email || ''

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-screen sticky top-0 border-r border-border bg-card/80 backdrop-blur-xl flex flex-col relative overflow-hidden"
        >
            {/* Subtle gradient accent */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            {/* Logo */}
            <div className={cn(
                "h-16 flex items-center border-b border-border px-4 relative z-10",
                collapsed ? "justify-center" : "justify-between"
            )}>
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                        <AxonIcon size={18} className="text-white" />
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-lg tracking-tight"
                        >
                            Axon
                        </motion.span>
                    )}
                </Link>
            </div>

            {/* Search shortcut */}
            {!collapsed && (
                <div className="px-4 py-4 relative z-10">
                    <Link
                        href="/dashboard/search"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-muted-foreground text-sm hover:border-primary/30 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span>Search knowledge...</span>
                        <span className="ml-auto text-xs font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">Ctrl+K</span>
                    </Link>
                </div>
            )}

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-2 space-y-1 relative z-10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative",
                                collapsed ? "justify-center" : "",
                                isActive
                                    ? "text-white"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                            <item.icon className={cn("w-5 h-5 shrink-0 relative z-10", isActive && "text-primary")} />
                            {!collapsed && <span className="relative z-10">{item.label}</span>}
                        </Link>
                    )
                })}

                {/* Divider */}
                <div className="!my-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {bottomItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                collapsed ? "justify-center" : "",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Status Badge */}
            {!collapsed && (
                <div className="p-4 relative z-10">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-primary/5 border border-emerald-500/15 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl" />
                        <div className="relative flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-emerald-400">Full Access</p>
                                <p className="text-[11px] text-muted-foreground">All features unlocked</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors z-20"
            >
                {collapsed ? (
                    <ChevronRight className="w-3 h-3" />
                ) : (
                    <ChevronLeft className="w-3 h-3" />
                )}
            </button>

            {/* Bottom User */}
            <div className={cn(
                "border-t border-border p-4 relative z-10",
                collapsed ? "flex justify-center" : ""
            )}>
                {collapsed ? (
                    <button onClick={handleSignOut} className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center hover:from-red-500/20 hover:to-red-500/10 transition-colors" title="Sign out">
                        <span className="text-sm font-bold text-primary">{userInitial}</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">{userInitial}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{userName}</p>
                            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                        </div>
                        <button onClick={handleSignOut} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors" title="Sign out">
                            <LogOut className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                        </button>
                    </div>
                )}
            </div>
        </motion.aside>
    )
}

export function DashboardHeader() {
    const pathname = usePathname()
    const [greeting, setGreeting] = useState('')
    const [pageTitle, setPageTitle] = useState('')

    useEffect(() => {
        setGreeting(getGreeting())
        setPageTitle(getPageTitle(pathname))
    }, [pathname])

    return (
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
            <div>
                <h1 className="font-bold text-lg">{pageTitle}</h1>
                <p className="text-xs text-muted-foreground">{greeting} - your knowledge base awaits</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="relative p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                </button>
                <Link
                    href="/dashboard/capture"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>New Entry</span>
                </Link>
            </div>
        </header>
    )
}
