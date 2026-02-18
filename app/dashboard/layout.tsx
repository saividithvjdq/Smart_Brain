'use client'

import { Sidebar, DashboardHeader } from '@/components/dashboard/layout'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
