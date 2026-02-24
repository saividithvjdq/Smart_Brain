import { NextRequest } from 'next/server'
import { adminAuth } from './admin'

/**
 * Verify Firebase Auth token from request Authorization header.
 * Returns userId if valid, null if not authenticated.
 */
export async function verifyAuth(request: NextRequest): Promise<string | null> {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.split('Bearer ')[1]
        if (!token) return null

        const decodedToken = await adminAuth.verifyIdToken(token)
        return decodedToken.uid
    } catch (error) {
        console.error('Auth verification failed:', error)
        return null
    }
}

/**
 * Require auth — returns userId or throws 401 response.
 */
export async function requireAuth(request: NextRequest): Promise<string> {
    const userId = await verifyAuth(request)
    if (!userId) {
        throw new Error('Unauthorized')
    }
    return userId
}
