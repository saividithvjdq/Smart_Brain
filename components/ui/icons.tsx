'use client'

import { motion } from 'framer-motion'

// Custom Axon Logo/Icon - Clean geometric minimalist design inspired by Scalepro
// Features a stylized "A" shape with a dot element for modern professional look
export function AxonIcon({
    size = 24,
    className = '',
    animated = false
}: {
    size?: number
    className?: string
    animated?: boolean
}) {
    const iconSize = size

    if (animated) {
        return (
            <motion.svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                className={className}
            >
                {/* Circle element - bottom left */}
                <motion.circle
                    cx="5.5"
                    cy="18.5"
                    r="3.5"
                    fill="currentColor"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                />
                {/* Geometric "A" shape - angular modern design */}
                <motion.path
                    d="M5.5 15V6C5.5 4.5 6.5 3 8.5 3H16C18 3 19.5 4.5 19.5 6.5V18.5C19.5 20 18.5 21 17 21H12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
            </motion.svg>
        )
    }

    return (
        <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            {/* Circle element - bottom left */}
            <circle
                cx="5.5"
                cy="18.5"
                r="3.5"
                fill="currentColor"
            />
            {/* Geometric shape - modern angular design */}
            <path
                d="M5.5 15V6C5.5 4.5 6.5 3 8.5 3H16C18 3 19.5 4.5 19.5 6.5V18.5C19.5 20 18.5 21 17 21H12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    )
}

// Minimalist icon set for replacing emojis
export function ClipboardIcon({ size = 16, className = '' }: { size?: number, className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="4" y="4" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

export function LightbulbIcon({ size = 16, className = '' }: { size?: number, className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M9 21H15M12 3C8.13 3 5 6.13 5 10C5 12.38 6.19 14.47 8 15.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V15.74C17.81 14.47 19 12.38 19 10C19 6.13 15.87 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

// Pre-calculated waveform heights to avoid Math.random() hydration issues
const WAVEFORM_HEIGHTS = [12, 16, 10, 18, 14, 20, 11, 17, 13, 19, 15, 12]

// Animated Voice Waveform - uses fixed heights to avoid hydration issues
export function VoiceWaveform({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-0.5 ${className}`}>
            {WAVEFORM_HEIGHTS.map((baseHeight, i) => (
                <motion.div
                    key={i}
                    className="w-0.5 bg-green-400/80 rounded-full"
                    initial={{ height: 8 }}
                    animate={{
                        height: [8, baseHeight, 8, Math.max(8, baseHeight - 4), 8]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}

// Animated Pulse Ring
export function PulseRing({ className = '' }: { className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            />
        </div>
    )
}

// Floating Animation Wrapper
export function FloatAnimation({
    children,
    delay = 0,
    duration = 3
}: {
    children: React.ReactNode
    delay?: number
    duration?: number
}) {
    return (
        <motion.div
            animate={{
                y: [0, -8, 0]
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay
            }}
        >
            {children}
        </motion.div>
    )
}
