import { Fragment } from "react"
import Navbar from "./Navbar"
import SignUpForm from "./Signup"
import SignInForm from "./Signin"
import LandingPage from "./LandingPage"
import Diagnosis from "./DiagnosisInterface"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import { useState, useEffect } from "react"
import axios from "axios"
import { Routes, Route} from "react-router-dom"

export default function App() {
    const [userContext, setUserContext] = useState({username: ''})

    useEffect(() => {
        autoLogin()
    }, [])

    async function autoLogin() {
        try {
            const response = await axios.get('http://localhost:8080/autoLogin')
            console.log('User is logged in')
            setUserContext({username: response.data.username})
        } catch (err) {
            console.log(err.response.data.message)
        }
    }


    return (
        <isUserLoggedIn.Provider value={{userContext, setUserContext}}>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<SignInForm/>}/>
                <Route path="/register" element={<SignUpForm/>}/>
                <Route path="/diagnosis" element={<Diagnosis/>}/>
            </Routes>
            {/* {userContext.username ? <LandingPage /> : <SignInForm />} */}
            {/* <SignUpForm /> */}
        </isUserLoggedIn.Provider>        
    )
}