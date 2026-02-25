'use client'

import React, { useId } from 'react'

interface AxonLogoProps {
    size?: number
    showText?: boolean
    className?: string
    /** Show spinning outer ring & pulse effects (disable for small navbar icons) */
    animated?: boolean
}

export const AxonLogo: React.FC<AxonLogoProps> = ({
    size = 120,
    showText = false,
    className = '',
    animated = false,
}) => {
    const uid = useId()
    const g = `axon-g-${uid}`
    const gR = `axon-gr-${uid}`
    const ng = `axon-ng-${uid}`
    const gl = `axon-gl-${uid}`

    // Coordinates for a pointy-top hexagon centered at 100,100 with R=58
    const nodes = [
        { x: 100, y: 42 },   // N (Top)
        { x: 150, y: 71 },   // NE
        { x: 150, y: 129 },  // SE
        { x: 100, y: 158 },  // S
        { x: 50, y: 129 },   // SW
        { x: 50, y: 71 },    // NW
    ]

    // Midpoints for A crossbar
    const crossLeft = { x: 75, y: 56.5 }
    const crossRight = { x: 125, y: 56.5 }

    return (
        <div
            className={`flex flex-col items-center justify-center ${className}`}
            style={{
                gap: `${Math.max(size * 0.08, 4)}px`,
                transform: 'rotate(0deg)' // Explicitly force upright
            }}
        >
            <div className="relative" style={{ width: size, height: size }}>
                {/* Ambient glow layers */}
                {animated && (
                    <>
                        <div
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                inset: '-20%',
                                background: 'radial-gradient(circle, rgba(110,50,255,0.22) 0%, transparent 68%)',
                                filter: 'blur(16px)',
                                animation: 'axon-breathe 3.5s ease-in-out infinite',
                            }}
                        />
                        <div
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                inset: '-5%',
                                background: 'radial-gradient(circle, rgba(200,40,220,0.18) 0%, transparent 65%)',
                                filter: 'blur(8px)',
                                animation: 'axon-breathe 3.5s ease-in-out infinite reverse',
                            }}
                        />
                    </>
                )}

                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-[2]"
                    style={{
                        // Keep shadows visible even when scaled down
                        filter: 'drop-shadow(0 0 2px rgba(130,70,255,0.95)) drop-shadow(0 0 6px rgba(180,40,230,0.65))',
                    }}
                >
                    <defs>
                        <linearGradient id={g} x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#7060FF" />
                            <stop offset="48%" stopColor="#A030E8" />
                            <stop offset="100%" stopColor="#D820BC" />
                        </linearGradient>
                        <linearGradient id={gR} x1="180" y1="20" x2="20" y2="180" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#D820BC" />
                            <stop offset="48%" stopColor="#A030E8" />
                            <stop offset="100%" stopColor="#7060FF" />
                        </linearGradient>
                        <radialGradient id={ng} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#E040FF" />
                            <stop offset="100%" stopColor="#7040FF" />
                        </radialGradient>
                        <filter id={gl}>
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* Outer dashed spinning ring */}
                    {animated && (
                        <circle
                            cx="100" cy="100" r="88"
                            stroke={`url(#${g})`} strokeWidth="1.5"
                            strokeDasharray="6 10" fill="none" opacity="0.4"
                            style={{ animation: 'axon-spin 12s linear infinite', transformOrigin: 'center' }}
                        />
                    )}

                    {/* Main solid circle */}
                    <circle cx="100" cy="100" r="78" stroke={`url(#${g})`} strokeWidth="4" fill="none" opacity="0.8" />

                    {/* Hexagon rim */}
                    <polygon
                        points={`${nodes[0].x},${nodes[0].y} ${nodes[1].x},${nodes[1].y} ${nodes[2].x},${nodes[2].y} ${nodes[3].x},${nodes[3].y} ${nodes[4].x},${nodes[4].y} ${nodes[5].x},${nodes[5].y}`}
                        stroke={`url(#${g})`} strokeWidth="4" fill="none"
                        strokeLinecap="round" strokeLinejoin="round"
                    />

                    {/* 6 Spokes: center → each node */}
                    {nodes.map((n, i) => (
                        <line
                            key={i}
                            x1="100" y1="100" x2={n.x} y2={n.y}
                            stroke={`url(#${i < 3 ? g : gR})`} strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={animated ? '8 24' : undefined}
                            style={animated ? { animation: 'axon-dash 2.5s linear infinite', animationDelay: `${i * 0.4}s` } : undefined}
                        />
                    ))}

                    {/* A shape peak: NW & NE → N */}
                    <line x1={nodes[5].x} y1={nodes[5].y} x2={nodes[0].x} y2={nodes[0].y} stroke={`url(#${g})`} strokeWidth="5" strokeLinecap="round" />
                    <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[0].x} y2={nodes[0].y} stroke={`url(#${g})`} strokeWidth="5" strokeLinecap="round" />

                    {/* A crossbar: centered horizontal */}
                    <line x1={crossLeft.x} y1={crossLeft.y} x2={crossRight.x} y2={crossRight.y} stroke={`url(#${g})`} strokeWidth="4.5" strokeLinecap="round" />

                    {/* X shape: NW→SE and NE→SW through center */}
                    <line x1={nodes[5].x} y1={nodes[5].y} x2={nodes[2].x} y2={nodes[2].y} stroke={`url(#${gR})`} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                    <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[4].x} y2={nodes[4].y} stroke={`url(#${gR})`} strokeWidth="5" strokeLinecap="round" opacity="0.9" />

                    {/* Node dots */}
                    {nodes.map((n, i) => (
                        <circle key={`n${i}`} cx={n.x} cy={n.y} r="6" fill={`url(#${ng})`} filter={`url(#${gl})`} />
                    ))}

                    {/* A crossbar end dots */}
                    <circle cx={crossLeft.x} cy={crossLeft.y} r="4" fill={`url(#${ng})`} filter={`url(#${gl})`} />
                    <circle cx={crossRight.x} cy={crossRight.y} r="4" fill={`url(#${ng})`} filter={`url(#${gl})`} />

                    {/* Central hub */}
                    <circle cx="100" cy="100" r="10" fill={`url(#${ng})`} filter={`url(#${gl})`} />
                    <circle cx="100" cy="100" r="5" fill="#fff" opacity="0.95" />
                </svg>
            </div>

            {showText && (
                <span
                    className="font-sans font-black tracking-[0.32em] select-none"
                    style={{
                        fontSize: `${Math.max(size * 0.19, 12)}px`,
                        background: 'linear-gradient(90deg, #7B5FFF 0%, #B030E0 50%, #E020B0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 12px rgba(160, 60, 240, 0.4))',
                    }}
                >
                    AXON
                </span>
            )}
        </div>
    )
}
