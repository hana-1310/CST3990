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
                <ul>
                    <Link to="/">HOME</Link>

                    
                    <button>PROFILE</button>
                    {!userContext.username ? <Link to="/login">SIGN IN</Link> : <Link onClick={logoutClick} to="/">LOGOUT</Link>}
                    <li>{userContext.username}</li>
                    
                </ul>
            </nav>
        </header>
    )
}