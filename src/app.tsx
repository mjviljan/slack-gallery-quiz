import './styles/defaults.less'
import './styles/keyframes.less'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'
import * as dotenv from 'dotenv'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Quiz } from './components/Quiz'
import { QuizUser } from './types/types'

dotenv.config()

if (!process.env.GOOGLE_ORGANIZATION || process.env.GOOGLE_ORGANIZATION.length === 0) {
    throw new Error('App configuration is invalid: Google organization (for authentication) is missing')
}
const authOrgEnv = process.env.GOOGLE_ORGANIZATION as string
const authOrgs = authOrgEnv.toLowerCase().split(',')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(<LoadingSpinner />)

const authProvider = new GoogleAuthProvider()
authProvider.addScope('email')
authProvider.setCustomParameters({ 'hd': authOrgs[0] })

const auth = getFirebaseAuth()

onAuthStateChanged(auth, async user => {
    if (user && user.email) {
        const userEmailDomain = user.email.toLowerCase().split('@').pop() as string
        if (authOrgs.includes(userEmailDomain)) {
            fetch('/users')
                .then((data: Response) => data.json())
                .then((users: Array<QuizUser>) => root.render(<Quiz users={users} />))
            return
        }
    }

    await signInWithRedirect(auth, authProvider)
})
