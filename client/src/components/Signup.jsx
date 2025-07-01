import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function SignUpForm() {

    /**Initialising states for the form's input fields */
    const [username, setUsername] = useState('')
    const [age, setAge] = useState('')
    const [password, setPassword] = useState('')
    const [weight, setWeight] = useState('')
    const [height, setHeight] = useState('')
    const [itching, setItching] = useState('')
    const [cramps, setCramps] = useState('')

    const [userExists, setUserExists] = useState(false)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    /**Function to oversee submission of sign up form 
     * and send the data to the API endpoint
    */
    async function handleClick(event) {
        event.preventDefault()
        convertToInteger()
        const formErrors = validateForm()
        setErrors(formErrors)
        console.log(errors)
        setUserExists(false)

        if (Object.keys(formErrors).length === 0) {
            
            let BMI_full = weight / ((height / 100) ** 2)
            const BMI = Math.round(BMI_full)

            console.log('BMI: ', BMI)
            try {
                const response = await axios.post('http://localhost:8080/database/register', 
                                                    {username, age, password, BMI, height, weight, cramps, itching})
                console.log(response)
                if (response.status === 200) {
                    alert('Account creation was a success!')
                    navigate('/login')
                }
            } catch (err) {
                console.log(err.response.data.message)
                if (err.response && err.response.status === 500) {
                    setUserExists(true)
                }
            }
        } else {
            console.log('Form submission was unsuccessful.')
        }
        
    }

    function convertToInteger() {
        const intAge = parseInt(age)
        const intWeight = parseInt(weight)
        const intHeight = parseInt(height)
        const intItchingCount = parseInt(itching)
        const intCrampsCount = parseInt(cramps)

        setAge(intAge)
        setWeight(intWeight)
        setHeight(intHeight)
        setItching(intItchingCount)
        setCramps(intCrampsCount)
    }

    function validateForm() {
        const errors = {}
        const emptyField = "Field cannot be empty"

        if (!username) {
            errors.username = emptyField
        } else if (username.length < 5) {
            errors.username = "Username must be at least 5 characters long"
            console.log(errors.username)
        }

        if (!age) {
            errors.age = emptyField
        } 

        if (!weight) {
            errors.weight = emptyField
        }

        if (!height) {
            errors.height = emptyField
        }

        if (!itching) {
            errors.itching = emptyField
        } else if (itching < 0 || itching > 10) {
            errors.itching = 'Input field: number, min=0, max=10'
        }

        if (!cramps) {
            errors.cramps = emptyField
        } else if (cramps < 0 || cramps > 8) {
            errors.cramps = 'Input field: number, min=0, max=7'
        }

        if (!password) {
            errors.password = emptyField
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters long"
        }
        return errors
    }

    

    return (
        <div className="signup-container">
            <form onSubmit={handleClick} className="signup-form">
                <h2>Create new account</h2>
                <hr />
                <label htmlFor="username-input">Username
                    <input 
                        id="username-input" 
                        type="text" 
                        name="username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                    {userExists && <p className="error">Username already in use</p>}
                </label>
                <label htmlFor="password-input">Password
                    <input 
                        id="password-input" 
                        type="text" 
                        name="password" 
                        value={password} 
                        onChange={(event) => setPassword(event.target.value)}/>
                    {errors.password && <p className="error">{errors.password}</p>}
                </label>
                <label htmlFor="age-input">Age
                    <input 
                        id="age-input" 
                        type="text" 
                        name="age" 
                        value={age} 
                        onChange={(event) =>setAge(event.target.value)}/>
                    {errors.age && <p className="error">{errors.age}</p>}
                </label>
                <label htmlFor="weight-input">Weight (kg)
                    <input 
                        id="weight-input" 
                        type="text" 
                        name="weight" 
                        value={weight} 
                        onChange={(event) => setWeight(event.target.value)}/>
                    {errors.weight && <p className="error">{errors.weight}</p>}
                </label>
                <label htmlFor="height-input">Height (cm)
                    <input 
                        id="height-input" 
                        type="text" 
                        name="height" 
                        value={height} 
                        onChange={(event) => setHeight(event.target.value)}/>
                    {errors.height && <p className="error">{errors.height}</p>}
                </label>
                <label htmlFor="itching-input">How severe is your itching on average?
                    <input 
                        id="itching-input" 
                        type="text" 
                        name="itching" 
                        value={itching}
                        onChange={(event) => setItching(event.target.value)}/>
                    {errors.itching && <p className="error">{errors.itching}</p>}
                </label>
                <label htmlFor="cramps-input">How many times per week do you experience muscle cramps?
                    <input 
                        id="cramps-input" 
                        type="text" 
                        name="cramps" 
                        value={cramps}
                        onChange={(event) => setCramps(event.target.value)}/>
                    {errors.cramps && <p className="error">{errors.cramps}</p>}
                </label>

                <button type="submit">Submit</button>
                <hr />
                
            </form>
            
        </div>
        
    )
}