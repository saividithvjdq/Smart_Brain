'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
    Brain,
    LayoutDashboard,
    PlusCircle,
    Search,
    MessageSquare,
    Settings,
    Zap,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    User
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

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 260 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-screen sticky top-0 border-r border-border bg-card flex flex-col"
            >
                {/* Logo */}
                <div className={cn(
                    "h-16 flex items-center border-b border-border px-4",
                    collapsed ? "justify-center" : "justify-between"
                )}>
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-semibold text-lg"
                            >
                                Axon
                            </motion.span>
                        )}
                    </Link>
                </div>

                {/* Search */}
                {!collapsed && (
                    <div className="px-4 py-4">
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground text-sm">
                            <Search className="w-4 h-4" />
                            <span>Search...</span>
                            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">⌘K</span>
                        </div>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-2 space-y-1">
                    {navItems.map((item) => {
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
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}

                    {/* Divider */}
                    <div className="!my-4 h-px bg-border" />

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
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Upgrade Card */}
                {!collapsed && (
                    <div className="p-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Upgrade to Pro</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                                Get unlimited AI queries and more.
                            </p>
                            <button className="w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                                Upgrade Pro
                            </button>
                        </div>
                    </div>
                )}

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-3 h-3" />
                    ) : (
                        <ChevronLeft className="w-3 h-3" />
                    )}
                </button>

                {/* Bottom User */}
                <div className={cn(
                    "border-t border-border p-4",
                    collapsed ? "flex justify-center" : ""
                )}>
                    {collapsed ? (
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <span className="text-sm font-medium text-white">AX</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Axon User</p>
                                <p className="text-xs text-muted-foreground truncate">Free Plan</p>
                            </div>
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <LogOut className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
                    <div>
                        <h1 className="font-semibold">Dashboard</h1>
                        <p className="text-xs text-muted-foreground">Welcome back to your knowledge base</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                            <PlusCircle className="w-4 h-4" />
                            New Entry
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
