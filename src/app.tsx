import './styles/defaults.less'
import './styles/keyframes.less'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth'
import { getFirebaseAuth } from './firebase'
import * as dotenv from 'dotenv'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Quiz } from './components/Quiz'
import { QuizUser } from './types/types'

dotenv.config()

const root = document.getElementById('root')

if (!process.env.GOOGLE_ORGANIZATION || process.env.GOOGLE_ORGANIZATION.length === 0) {
    throw new Error('App configuration is invalid: Google organization (for authentication) is missing')
}
const authOrg = process.env.GOOGLE_ORGANIZATION as string

ReactDOM.render(<LoadingSpinner />, root)

const authProvider = new GoogleAuthProvider()
authProvider.addScope('email')
authProvider.setCustomParameters({ 'hd': authOrg })

const auth = getFirebaseAuth()

onAuthStateChanged(auth, async user => {
    if (user && user.email && user.email.endsWith(`@${authOrg}`)) {
        fetch('/users')
            .then((data: Response) => data.json())
            .then((users: Array<QuizUser>) => ReactDOM.render(<Quiz users={users} />, root))
    } else {
        await signInWithRedirect(auth, authProvider)
    }
})
