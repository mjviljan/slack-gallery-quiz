import * as React from "react"
import * as ReactDOM from "react-dom"
import * as firebase from 'firebase/app'
import "firebase/auth"
import "./firebase"
import * as dotenv from "dotenv"
import { LoadingSpinner } from "./components/loadingSpinner"
import { Quiz } from "./components/quiz"

dotenv.config()

const root = document.getElementById('root')

ReactDOM.render(
    <LoadingSpinner />,
    root
)

const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user) {
        ReactDOM.render(
            <Quiz />,
            root
        )
    } else {
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.setCustomParameters({ hd: process.env.GOOGLE_ORGANIZATION })
        firebase.auth().signInWithRedirect(provider)
    }
    unsubscribe()
})
