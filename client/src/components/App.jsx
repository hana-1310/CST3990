import { Fragment } from "react"
import Navbar from "./Navbar"
import SignUpForm from "./Signup"
import SignInForm from "./Signin"
import LandingPage from "./Home"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import { useState, useEffect } from "react"
import axios from "axios"
import {BrowserRouter, Router, Switch} from "react-router-dom"

export default function App() {
    const [userContext, setUserContext] = useState({username: ''})

    useEffect(() => {
        autoLogin()
    }, [])

    async function autoLogin() {
        const response = await axios.get('http://localhost:8080/autoLogin')

        if (response.status === 200) {
            console.log('User is logged in')
            setUserContext({username: response.data.username})
        }
    }

    return (
        <isUserLoggedIn.Provider value={{userContext, setUserContext}}>
            <Navbar />
            {userContext.username ? <LandingPage /> : <SignInForm />}
            {/* <SignUpForm /> */}
        </isUserLoggedIn.Provider>
    )
}