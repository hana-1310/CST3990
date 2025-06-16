import axios from "axios"
import { useState, useContext } from "react"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import { Link, useNavigate } from "react-router-dom"

export default function SignInForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const {userContext, setUserContext} = useContext(isUserLoggedIn)
    const navigate = useNavigate()

    async function handleClick(event) {
        event.preventDefault

        try {
            const response = await axios.post('http://localhost:8080/database/login',
                                            {username, password}, {withCredentials: true}
            )
            if (response.status === 200) {
                setUserContext({username: response.data.username})
                console.log(response.data.message)
                navigate('/')
            }
        } catch (err) {
            console.error(err.response.data.message)
            setError(err.response.data.message)
        }

    }

    return (
        <div className="signin-container">
            <form action={handleClick} className="signin-form">
                <h2>Sign In</h2>
                <p>Access CKDVitaGuide's features by signing in to your account</p>
                <hr />
                <label htmlFor="username-input">Username
                    <input 
                        type="text" 
                        id="username-input"
                        name="username" 
                        value={username} 
                        onChange={event => setUsername(event.target.value)}
                        required
                    />
                    {error && <p>{error}</p>}

                </label>
                <label htmlFor="password-input">Password
                    <input 
                        type="text" 
                        id="password-input"
                        name="password" 
                        value={password} 
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </label>
                <button type="submit">Sign In</button>
                <hr />
                <p>No account yet?</p>
                <Link to="/register">Create new account instead</Link>
            </form>
        </div>
        
        
    )
}