import { useContext, useEffect } from "react"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Navbar() {
    const {userContext, setUserContext} = useContext(isUserLoggedIn)

    async function logoutClick() {
        const response = await axios.get('http://localhost:8080/logout')

        if (response.status === 200) {
            setUserContext(prevUser => ({
                ...prevUser,
                username: ''
            }))
            console.log('User logged out')
        }
    }


    return (
        <header>
            <nav>
                <img src="/images/logo.png" alt="" />
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li>{!userContext.username ? <Link to="/login">Sign In</Link> : <Link onClick={logoutClick} to="/">Sign Out</Link>}</li>

                    <li className="profile">
                        <img src="/images/user-icon.png" alt="" />
                        {!userContext.username ? <Link to="/login">Profile</Link> : <Link to="/register">Hi {userContext.username}!</Link>}
                    </li>
                    
                </ul>
            </nav>
        </header>
    )
}