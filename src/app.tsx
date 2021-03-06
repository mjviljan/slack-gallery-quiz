import './styles/defaults.less'
import './styles/keyframes.less'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import './firebase'
import * as dotenv from 'dotenv'
import { LoadingSpinner } from './components/LoadingSpinner'
import { Quiz } from './components/Quiz'
import { QuizUser } from './types/types'

dotenv.config()

const root = document.getElementById('root')

ReactDOM.render(<LoadingSpinner />, root)

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user && user.email && user.email.endsWith('@' + process.env.GOOGLE_ORGANIZATION)) {
        fetch('/users')
            .then((data: Response) => data.json())
            .then((users: Array<QuizUser>) => {
                return ReactDOM.render(<Quiz users={users} />, root)
            })
    } else {
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.setCustomParameters({ hd: process.env.GOOGLE_ORGANIZATION })
        firebase.auth().signInWithRedirect(provider)
    }
    unsubscribe()
})
