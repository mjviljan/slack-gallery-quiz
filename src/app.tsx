import * as React from "react"
import * as ReactDOM from "react-dom"
import * as firebase from 'firebase/app'
import "firebase/auth"
import "./firebase"
import * as dotenv from "dotenv"
import { LoadingSpinner } from "./components/loadingSpinner"

dotenv.config()

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log('User logged in')
    } else {
        console.log('User NOT logged in')
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.setCustomParameters({ hd: process.env.GOOGLE_ORGANIZATION })
        firebase.auth().signInWithRedirect(provider)
    }
});

ReactDOM.render(
    <LoadingSpinner />,
    document.getElementById('root')
);
