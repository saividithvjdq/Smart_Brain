import { Sidebar, DashboardHeader } from '@/components/dashboard/layout'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="ml-64">
                <DashboardHeader />
                <div className="p-6">{children}</div>
            </main>
        </div>
    )
}
