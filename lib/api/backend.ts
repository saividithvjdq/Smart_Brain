/**
 * Backend API Helper — Calls the Python FastAPI backend
 * 
 * LEARNING:
 *   This helper forwards the user's Firebase auth token to the Python backend.
 *   Falls back gracefully if the Python backend is unavailable.
 * 
 *   Architecture:
 *   Frontend (Next.js/Vercel) → Python Backend (Render) → Groq/Gemini + ChromaDB
 */

const BACKEND_URL = process.env.PYTHON_BACKEND_URL || process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:8000'

interface BackendOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: Record<string, unknown>
    token?: string
    timeout?: number
}

interface BackendResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Call the Python backend with auth token forwarding.
 * Returns { success: false } if backend is unreachable (for graceful fallback).
 */
export async function callBackend<T = unknown>(
    path: string,
    options: BackendOptions = {}
): Promise<BackendResponse<T>> {
    const { method = 'GET', body, token, timeout = 10000 } = options

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(`${BACKEND_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
                success: false,
                error: errorData.detail || `Backend error: ${response.status}`,
            }
        }

        const data = await response.json()
        return { success: true, data: data as T }
    } catch (error) {
        // Backend unreachable — this is expected in dev when backend isn't running
        console.warn(`[Backend] ${path} failed:`, error instanceof Error ? error.message : 'Unknown error')
        return {
            success: false,
            error: 'Backend unavailable',
        }
    }
}

/**
 * Check if the Python backend is healthy.
 */
export async function isBackendHealthy(): Promise<boolean> {
    const result = await callBackend('/health', { timeout: 3000 })
    return result.success
}
