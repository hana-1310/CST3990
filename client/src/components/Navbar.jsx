import { useContext, useEffect } from "react"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import axios from "axios"

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
                    <button>HOME</button>
                    
                    <button>PROFILE</button>
                    {!userContext.username ? <button>SIGN IN</button> : <button onClick={logoutClick}>LOGOUT</button>}
                    <li>{userContext.username}</li>
                    
                </ul>
            </nav>
        </header>
    )
}