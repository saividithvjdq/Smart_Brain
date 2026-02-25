'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Premium animated splash screen for Axon.
 * The hexagonal logo disintegrates outward (nodes scatter),
 * then reassembles with a rotation, followed by "AXON" text reveal.
 */
export function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [phase, setPhase] = useState<'assemble' | 'reveal' | 'done'>('assemble')

    useEffect(() => {
        const revealTimer = setTimeout(() => setPhase('reveal'), 800)
        const doneTimer = setTimeout(() => setPhase('done'), 1600)
        const finishTimer = setTimeout(() => onFinish(), 2200)

        return () => {
            clearTimeout(revealTimer)
            clearTimeout(doneTimer)
            clearTimeout(finishTimer)
        }
    }, [onFinish])

    // Node positions in the hexagon (relative to 100,100 center)
    const nodes = [
        { cx: 100, cy: 44 },   // Top
        { cx: 148, cy: 72 },   // Top-right
        { cx: 148, cy: 128 },  // Bottom-right
        { cx: 100, cy: 156 },  // Bottom
        { cx: 52, cy: 128 },   // Bottom-left
        { cx: 52, cy: 72 },    // Top-left
    ]

    // Scatter directions (each node flies out in its direction then comes back)
    const scatterOffsets = [
        { x: 0, y: -60 },
        { x: 52, y: -30 },
        { x: 52, y: 30 },
        { x: 0, y: 60 },
        { x: -52, y: 30 },
        { x: -52, y: -30 },
    ]

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    key="splash"
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080a14]"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Ambient glow */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(110,50,255,0.12) 0%, transparent 70%)' }}
                            animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>

                    <div className="relative flex flex-col items-center">
                        {/* Rotating logo container */}
                        <motion.div
                            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <svg
                                width={180}
                                height={180}
                                viewBox="0 0 200 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    filter: 'drop-shadow(0 0 8px rgba(130,70,255,0.95)) drop-shadow(0 0 24px rgba(180,40,230,0.65))',
                                }}
                            >
                                <defs>
                                    <linearGradient id="sg" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#7060FF" />
                                        <stop offset="48%" stopColor="#A030E8" />
                                        <stop offset="100%" stopColor="#D820BC" />
                                    </linearGradient>
                                    <linearGradient id="sgR" x1="180" y1="20" x2="20" y2="180" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#D820BC" />
                                        <stop offset="48%" stopColor="#A030E8" />
                                        <stop offset="100%" stopColor="#7060FF" />
                                    </linearGradient>
                                    <radialGradient id="sng" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#E040FF" />
                                        <stop offset="100%" stopColor="#7040FF" />
                                    </radialGradient>
                                    <filter id="sgl">
                                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                </defs>

                                {/* Outer spinning dashed ring */}
                                <motion.circle
                                    cx="100" cy="100" r="88"
                                    stroke="url(#sg)" strokeWidth="2"
                                    strokeDasharray="6 10" fill="none" opacity="0.5"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                                    style={{ transformOrigin: '100px 100px' }}
                                />

                                {/* Main circle — draws in */}
                                <motion.circle
                                    cx="100" cy="100" r="78"
                                    stroke="url(#sg)" strokeWidth="5" fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.7, ease: 'easeOut' }}
                                />

                                {/* Hexagon rim — draws in */}
                                <motion.polygon
                                    points="100,44 148,72 148,128 100,156 52,128 52,72"
                                    stroke="url(#sg)" strokeWidth="4" fill="none"
                                    strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                                />

                                {/* A shape legs + crossbar */}
                                <motion.line x1="52" y1="72" x2="100" y2="44"
                                    stroke="url(#sg)" strokeWidth="5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                />
                                <motion.line x1="148" y1="72" x2="100" y2="44"
                                    stroke="url(#sg)" strokeWidth="5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.4, delay: 0.35 }}
                                />
                                <motion.line x1="76" y1="58" x2="124" y2="58"
                                    stroke="url(#sg)" strokeWidth="4.5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 }}
                                />

                                {/* X diagonals */}
                                <motion.line x1="52" y1="72" x2="148" y2="128"
                                    stroke="url(#sgR)" strokeWidth="5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.45 }}
                                />
                                <motion.line x1="148" y1="72" x2="52" y2="128"
                                    stroke="url(#sgR)" strokeWidth="5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                />

                                {/* 6 spokes */}
                                {nodes.map((n, i) => (
                                    <motion.line
                                        key={`spoke-${i}`}
                                        x1="100" y1="100" x2={n.cx} y2={n.cy}
                                        stroke={`url(#${i < 2 || i === 5 ? 'sg' : 'sgR'})`}
                                        strokeWidth="3.5" strokeLinecap="round"
                                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                                    />
                                ))}

                                {/* Node dots — scatter in from outside */}
                                {nodes.map((n, i) => (
                                    <motion.circle
                                        key={`node-${i}`}
                                        cx={n.cx} cy={n.cy} r="6"
                                        fill="url(#sng)" filter="url(#sgl)"
                                        initial={{
                                            cx: n.cx + scatterOffsets[i].x,
                                            cy: n.cy + scatterOffsets[i].y,
                                            opacity: 0,
                                            scale: 0.3,
                                        }}
                                        animate={{ cx: n.cx, cy: n.cy, opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                ))}

                                {/* A crossbar end dots */}
                                <motion.circle cx="76" cy="58" r="4" fill="url(#sng)" filter="url(#sgl)"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                />
                                <motion.circle cx="124" cy="58" r="4" fill="url(#sng)" filter="url(#sgl)"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: 0.55 }}
                                />

                                {/* Central hub */}
                                <motion.circle cx="100" cy="100" r="10" fill="url(#sng)" filter="url(#sgl)"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3, ease: 'backOut' }}
                                    style={{ transformOrigin: '100px 100px' }}
                                />
                                <motion.circle cx="100" cy="100" r="5" fill="#fff" opacity="0.9"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4, ease: 'backOut' }}
                                    style={{ transformOrigin: '100px 100px' }}
                                />
                            </svg>
                        </motion.div>

                        {/* AXON text */}
                        <motion.span
                            className="mt-6 font-sans font-black tracking-[0.35em] text-3xl select-none"
                            style={{
                                background: 'linear-gradient(90deg, #7B5FFF 0%, #B030E0 50%, #E020B0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 12px rgba(160, 60, 240, 0.5))',
                            }}
                            initial={{ opacity: 0, y: 15, letterSpacing: '0.6em' }}
                            animate={phase === 'reveal'
                                ? { opacity: 1, y: 0, letterSpacing: '0.35em' }
                                : { opacity: 0, y: 15, letterSpacing: '0.6em' }
                            }
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            AXON
                        </motion.span>

                        {/* Tagline */}
                        <motion.span
                            className="mt-1 font-mono text-[10px] tracking-[0.4em] uppercase select-none"
                            style={{ color: 'rgba(180, 130, 255, 0.5)' }}
                            initial={{ opacity: 0 }}
                            animate={phase === 'reveal' ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                        >
                            neural intelligence
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
