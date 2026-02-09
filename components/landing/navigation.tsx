'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '/docs', label: 'Docs' },
    { href: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between px-6 py-3 rounded-2xl glass">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold hidden sm:block">
                            Second<span className="gradient-text">Brain</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                            Sign In
                        </Button>
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0"
                        >
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden mt-2 p-4 rounded-xl glass"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="border-white/10" />
                            <Button
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0"
                            >
                                Get Started
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}

export function Footer() {
    return (
        <footer className="relative py-16 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold">SecondBrain</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-8 text-sm text-muted-foreground">
                        <Link href="/docs" className="hover:text-foreground transition-colors">
                            Documentation
                        </Link>
                        <Link href="/api/public/brain/query" className="hover:text-foreground transition-colors">
                            API
                        </Link>
                        <a href="https://github.com/saividithvjdq/second-brain" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                            GitHub
                        </a>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        © 2026 SecondBrain. Built for Altibbe.
                    </p>
                </div>
            </div>
        </footer>
    )
}
