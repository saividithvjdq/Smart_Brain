'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    signOut as firebaseSignOut,
    type User,
} from 'firebase/auth'
import { auth } from './config'

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    sendEmailLink: (email: string) => Promise<void>
    completeEmailLinkSignIn: (email: string, link: string) => Promise<void>
    isEmailLink: (link: string) => boolean
    signOut: () => Promise<void>
    getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const googleProvider = new GoogleAuthProvider()

const ACTION_CODE_SETTINGS = {
    url: typeof window !== 'undefined'
        ? `${window.location.origin}/login`
        : 'http://localhost:3000/login',
    handleCodeInApp: true,
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
            if (user) {
                document.cookie = `firebase-auth-session=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
            } else {
                document.cookie = 'firebase-auth-session=; path=/; max-age=0'
            }
        })
        return () => unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const signUp = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleProvider)
    }

    const sendEmailLink = async (email: string) => {
        const settings = {
            ...ACTION_CODE_SETTINGS,
            url: `${window.location.origin}/login`,
        }
        await sendSignInLinkToEmail(auth, email, settings)
        window.localStorage.setItem('emailForSignIn', email)
    }

    const completeEmailLinkSignIn = async (email: string, link: string) => {
        await signInWithEmailLink(auth, email, link)
        window.localStorage.removeItem('emailForSignIn')
    }

    const isEmailLinkFn = (link: string) => {
        return isSignInWithEmailLink(auth, link)
    }

    const signOut = async () => {
        await firebaseSignOut(auth)
    }

    const getIdToken = async (): Promise<string | null> => {
        if (!user) return null
        return user.getIdToken()
    }

    return (
        <AuthContext.Provider value={{
            user, loading, signIn, signUp, signInWithGoogle,
            sendEmailLink, completeEmailLinkSignIn,
            isEmailLink: isEmailLinkFn, signOut, getIdToken,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
