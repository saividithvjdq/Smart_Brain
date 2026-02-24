import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/firebase/auth-helpers'
import { updateUserProfile, createUserProfile } from '@/lib/firebase/firestore'

// POST /api/user/onboarding - Mark onboarding complete
export async function POST(request: NextRequest) {
    try {
        const userId = await verifyAuth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await updateUserProfile(userId, { onboardingComplete: true })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Onboarding update error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// GET /api/user/onboarding - Get user profile (check onboarding status)
export async function GET(request: NextRequest) {
    try {
        const userId = await verifyAuth(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { getUserProfile } = await import('@/lib/firebase/firestore')
        let profile = await getUserProfile(userId)

        // Auto-create profile on first access
        if (!profile) {
            const { adminAuth } = await import('@/lib/firebase/admin')
            const user = await adminAuth.getUser(userId)
            await createUserProfile(userId, user.email || '', user.displayName || undefined)
            profile = await getUserProfile(userId)
        }

        return NextResponse.json({ profile })
    } catch (error) {
        console.error('Get profile error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
