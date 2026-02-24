'use client'

import { Sidebar, DashboardHeader } from '@/components/dashboard/layout'
import { OnboardingGuide } from '@/components/dashboard/onboarding'
import { useAuth } from '@/lib/firebase/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading your brain...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-background flex">
            <OnboardingGuide />
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
