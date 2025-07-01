import { Fragment } from "react"
import Navbar from "./Navbar"
import SignUpForm from "./Signup"
import SignInForm from "./Signin"
import LandingPage from "./LandingPage"
import Diagnosis from "./DiagnosisInterface"
import ShowRecommendations from "./DiagnosisResults"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import { useState, useEffect } from "react"
import axios from "axios"
import { Routes, Route} from "react-router-dom"
import DisplayProfile from "./Dashboard"

export default function App() {

    // state to store user context (handy for restricting access to certain parts
    // of the web app
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
        // provides user context to all components inside the app
        <isUserLoggedIn.Provider value={{userContext, setUserContext}}>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<SignInForm/>}/>
                <Route path="/register" element={<SignUpForm/>}/>
                <Route path="/diagnosis" element={<Diagnosis/>}/>
                <Route path="/recommendations" element={<ShowRecommendations/>}/>
                <Route path="/profile" element={<DisplayProfile/>}/>
                
            </Routes>
            {/* {userContext.username ? <LandingPage /> : <SignInForm />} */}
            {/* <SignUpForm /> */}
        </isUserLoggedIn.Provider>        
    )
}