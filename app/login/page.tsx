'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Brain, CheckCircle, Loader2 } from 'lucide-react'
import { AxonIcon } from '@/components/ui/icons'
import Link from 'next/link'
import { useAuth } from '@/lib/firebase/auth-context'
import ShaderBackground from '@/components/ui/shader-background'

const ease = [0.16, 1, 0.3, 1] as const

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [emailLinkSent, setEmailLinkSent] = useState(false)
    const [completingSignIn, setCompletingSignIn] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const {
        signIn, signUp, signInWithGoogle,
        sendEmailLink, completeEmailLinkSignIn, isEmailLink, user,
    } = useAuth()

    const redirect = searchParams.get('redirect') || '/dashboard'

    // Redirect if already signed in
    useEffect(() => {
        if (user) router.push(redirect)
    }, [user, router, redirect])

    // Handle email link completion (user clicked magic link in their email)
    useEffect(() => {
        const url = window.location.href
        if (isEmailLink(url)) {
            setCompletingSignIn(true)
            let savedEmail = window.localStorage.getItem('emailForSignIn')
            if (!savedEmail) {
                savedEmail = window.prompt('Please enter your email to confirm sign-in:')
            }
            if (savedEmail) {
                completeEmailLinkSignIn(savedEmail, url)
                    .then(() => router.push('/dashboard'))
                    .catch((err: unknown) => {
                        const e = err as { message?: string }
                        setError(e.message || 'Sign-in link expired. Please try again.')
                        setCompletingSignIn(false)
                    })
            } else {
                setError('Email required to complete sign-in.')
                setCompletingSignIn(false)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Email/Password submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    setError('Passwords do not match')
                    setLoading(false)
                    return
                }
                await signUp(email, password)
            } else {
                await signIn(email, password)
            }
            router.push(redirect)
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
                    if (firebaseError.message?.includes('signup-are-blocked')) {
                        setError('Email signup is temporarily blocked. Try "Sign in with Google" or "Send Magic Link" instead.')
                    } else {
                        setError(firebaseError.message || 'Something went wrong')
                    }
            }
        } finally {
            setLoading(false)
        }
    }

    // Google sign-in
    const handleGoogleSignIn = async () => {
        setError('')
        setGoogleLoading(true)
        try {
            await signInWithGoogle()
            router.push(redirect)
        } catch (err: unknown) {
            const e = err as { code?: string; message?: string }
            if (e.code === 'auth/popup-closed-by-user') {
                // User closed the popup, not an error
            } else {
                setError(e.message || 'Google sign-in failed')
            }
        } finally {
            setGoogleLoading(false)
        }
    }

    // Email link (passwordless)
    const handleSendEmailLink = async () => {
        if (!email) {
            setError('Please enter your email first')
            return
        }
        setError('')
        setLoading(true)
        try {
            await sendEmailLink(email)
            setEmailLinkSent(true)
        } catch (err: unknown) {
            const e = err as { message?: string }
            setError(e.message || 'Failed to send sign-in link')
        } finally {
            setLoading(false)
        }
    }

    // Completing email link sign-in
    if (completingSignIn) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Completing sign-in...</p>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 mix-blend-screen opacity-40">
                <ShaderBackground slow={true} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease }}
                className="relative z-10 w-full max-w-md px-6"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <AxonIcon size={44} />
                    </motion.div>
                    <span className="text-2xl font-bold font-heading tracking-tight">Axon</span>
                </Link>

                {/* Card */}
                <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {emailLinkSent ? (
                            /* ── Email Link Sent ── */
                            <motion.div
                                key="sent"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, ease: "backOut", delay: 0.1 }}
                                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </motion.div>
                                <h1 className="text-xl font-bold mb-2">Check your email</h1>
                                <p className="text-sm text-muted-foreground mb-2">We sent a sign-in link to</p>
                                <p className="text-sm font-medium text-primary mb-6">{email}</p>
                                <p className="text-xs text-muted-foreground mb-6">
                                    Click the link in your email to sign in — no password needed!
                                </p>
                                <button
                                    onClick={() => { setEmailLinkSent(false); setEmail('') }}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    ← Back to sign in
                                </button>
                            </motion.div>
                        ) : (
                            /* ── Main Form ── */
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="text-center mb-6">
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
                                        className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Google Sign-in Button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={googleLoading}
                                    className="w-full mb-4 py-3 rounded-xl border border-white/10 bg-background/50 text-sm font-medium flex items-center justify-center gap-3 hover:bg-white/5 hover:border-white/20 transition-all disabled:opacity-50"
                                >
                                    {googleLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    )}
                                    Continue with Google
                                </button>

                                {/* Divider */}
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-card/50 px-3 text-muted-foreground">or continue with email</span>
                                    </div>
                                </div>

                                {/* Email/Password Form */}
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

                                    {/* Confirm Password (sign-up only) */}
                                    {isSignUp && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, ease }}
                                        >
                                            <label className="block text-sm font-medium mb-2 text-muted-foreground">Confirm Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm your password"
                                                    required={isSignUp}
                                                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Submit */}
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

                                {/* Magic Link Option */}
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        onClick={handleSendEmailLink}
                                        disabled={loading}
                                        className="w-full py-2.5 rounded-xl border border-white/5 text-xs text-muted-foreground hover:text-foreground hover:border-white/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-3 h-3" />
                                        Send Magic Link (no password)
                                    </button>
                                </div>

                                {/* Toggle Sign In / Sign Up */}
                                <div className="mt-5 text-center">
                                    <button
                                        onClick={() => {
                                            setIsSignUp(!isSignUp)
                                            setError('')
                                            setConfirmPassword('')
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
                            </motion.div>
                        )}
                    </AnimatePresence>
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
