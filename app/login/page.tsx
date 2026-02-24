'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Brain } from 'lucide-react'
import { AxonIcon } from '@/components/ui/icons'
import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth-context'

const ease = [0.16, 1, 0.3, 1] as const

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { signIn, signUp } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isSignUp) {
                await signUp(email, password)
            } else {
                await signIn(email, password)
            }
            router.push('/dashboard')
        } catch (err: unknown) {
            const firebaseError = err as { code?: string; message?: string }
            switch (firebaseError.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email')
                    break
                case 'auth/wrong-password':
                    setError('Incorrect password')
                    break
                case 'auth/email-already-in-use':
                    setError('An account already exists with this email')
                    break
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters')
                    break
                case 'auth/invalid-email':
                    setError('Please enter a valid email address')
                    break
                case 'auth/invalid-credential':
                    setError('Invalid email or password')
                    break
                default:
                    setError(firebaseError.message || 'Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
            {/* Background gradient orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/15 rounded-full blur-[128px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25"
                    >
                        <AxonIcon size={24} className="text-white" />
                    </motion.div>
                    <span className="text-2xl font-bold font-heading tracking-tight">Axon</span>
                </Link>

                {/* Card */}
                <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {isSignUp
                                ? 'Start building your second brain'
                                : 'Sign in to access your knowledge base'}
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isSignUp ? 'Minimum 6 characters' : 'Enter your password'}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.01 }}
                            whileTap={{ scale: loading ? 1 : 0.99 }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-60 btn-shimmer"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError('')
                            }}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isSignUp ? (
                                <>Already have an account? <span className="text-primary font-medium">Sign in</span></>
                            ) : (
                                <>Don&apos;t have an account? <span className="text-primary font-medium">Sign up</span></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Branding */}
                <p className="text-center mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <Brain className="w-3 h-3" />
                    Secured by Firebase Authentication
                </p>
            </motion.div>
        </main>
    )
}
