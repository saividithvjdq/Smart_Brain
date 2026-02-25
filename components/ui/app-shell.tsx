'use client'

import { useState, useCallback } from 'react'
import { SplashScreen } from '@/components/ui/splash-screen'

export function AppShell({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true)

    const handleSplashFinish = useCallback(() => {
        setShowSplash(false)
    }, [])

    return (
        <>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            <div style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
                {children}
            </div>
        </>
    )
}
