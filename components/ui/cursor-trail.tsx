'use client'

import { useEffect, useRef } from 'react'

interface TrailPoint {
    x: number
    y: number
    age: number
}

export function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointsRef = useRef<TrailPoint[]>([])
    const mouseRef = useRef({ x: 0, y: 0 })
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
            pointsRef.current.push({
                x: e.clientX,
                y: e.clientY,
                age: 0,
            })
        }
        window.addEventListener('mousemove', handleMouseMove)

        const maxAge = 40 // frames before trail point disappears
        const trailSize = 120 // radius of glow

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Age and filter points
            pointsRef.current = pointsRef.current
                .map(p => ({ ...p, age: p.age + 1 }))
                .filter(p => p.age < maxAge)

            // Draw trail
            for (const point of pointsRef.current) {
                const progress = point.age / maxAge
                const alpha = (1 - progress) * 0.15
                const size = trailSize * (1 - progress * 0.3)

                // Purple-blue-pink gradient glow
                const gradient = ctx.createRadialGradient(
                    point.x, point.y, 0,
                    point.x, point.y, size
                )

                // Outer color shifts based on position for variety
                const hue1 = 270 + Math.sin(point.x * 0.003) * 30 // Purple range
                const hue2 = 230 + Math.cos(point.y * 0.003) * 30 // Blue range

                gradient.addColorStop(0, `hsla(${hue1}, 80%, 65%, ${alpha})`)
                gradient.addColorStop(0.4, `hsla(${(hue1 + hue2) / 2}, 70%, 55%, ${alpha * 0.6})`)
                gradient.addColorStop(1, `hsla(${hue2}, 60%, 45%, 0)`)

                ctx.fillStyle = gradient
                ctx.fillRect(
                    point.x - size,
                    point.y - size,
                    size * 2,
                    size * 2
                )
            }

            // Draw main cursor glow (stronger)
            if (pointsRef.current.length > 0) {
                const { x, y } = mouseRef.current
                const mainGradient = ctx.createRadialGradient(x, y, 0, x, y, 80)
                mainGradient.addColorStop(0, 'hsla(270, 85%, 65%, 0.12)')
                mainGradient.addColorStop(0.5, 'hsla(250, 75%, 55%, 0.05)')
                mainGradient.addColorStop(1, 'hsla(230, 65%, 45%, 0)')
                ctx.fillStyle = mainGradient
                ctx.fillRect(x - 80, y - 80, 160, 160)
            }

            rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ mixBlendMode: 'screen' }}
        />
    )
}
