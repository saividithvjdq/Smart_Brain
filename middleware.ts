import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedPaths = ['/dashboard']

// Routes that should redirect to dashboard if already authenticated
const authPaths = ['/login']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if user has a Firebase auth session cookie
    // Note: Firebase client SDK uses IndexedDB, not cookies by default
    // We use a lightweight approach: check for a custom session indicator
    const hasSession = request.cookies.get('firebase-auth-session')

    // Protect dashboard routes
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
        if (!hasSession) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // Redirect authenticated users away from login
    if (authPaths.some((path) => pathname.startsWith(path))) {
        if (hasSession) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
}
