import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

function getFirebaseAdmin() {
    if (getApps().length) {
        return {
            adminDb: getFirestore(),
            adminAuth: getAuth(),
        }
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (!serviceAccountKey) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set')
    }

    let serviceAccount: ServiceAccount
    try {
        const parsed = JSON.parse(serviceAccountKey)
        serviceAccount = {
            projectId: parsed.project_id,
            privateKey: parsed.private_key,
            clientEmail: parsed.client_email,
        }
    } catch {
        throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY — ensure it is valid JSON')
    }

    initializeApp({
        credential: cert(serviceAccount),
    })

    return {
        adminDb: getFirestore(),
        adminAuth: getAuth(),
    }
}

export const { adminDb, adminAuth } = getFirebaseAdmin()
