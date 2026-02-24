import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/firebase/auth-helpers'
import { getKnowledgeStats } from '@/lib/firebase/firestore'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
    try {
        const userId = await verifyAuth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const stats = await getKnowledgeStats(userId)
        return NextResponse.json(stats)
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
