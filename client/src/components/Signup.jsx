import axios from "axios"
import { useEffect, useState } from "react"
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

    /**Function to oversee submission of sign up form 
     * and send the data to the API endpoint
    */
    async function handleClick(event) {
        event.preventDefault()
        convertToInteger()
        const formErrors = validateForm()
        setErrors(formErrors)
        console.log(errors)

        if (Object.keys(formErrors).length === 0) {
            
            const BMI = weight / ((height / 100) ** 2)

            console.log('BMI: ', BMI)
            try {
                const response = await axios.post('http://localhost:8080/database/register', 
                                                    {username, age, password, BMI, height, weight, cramps, itching})
                console.log(response)
            } catch (err) {
                console.log(err)
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
        <form onSubmit={handleClick}>
            <label htmlFor="username-input">Username
                <input 
                    id="username-input" 
                    type="text" 
                    name="username" 
                    value={username} 
                    onChange={(event) => setUsername(event.target.value)}
                />
                {errors.username && <p>{errors.username}</p>}
            </label>
            
            <label htmlFor="age-input">Age
                <input 
                    id="age-input" 
                    type="text" 
                    name="age" 
                    value={age} 
                    onChange={(event) =>setAge(event.target.value)}/>
                {errors.age && <p>{errors.age}</p>}
            </label>
            <label htmlFor="weight-input">Weight
                <input 
                    id="weight-input" 
                    type="text" 
                    name="weight" 
                    value={weight} 
                    onChange={(event) => setWeight(event.target.value)}/>
                {errors.weight && <p>{errors.weight}</p>}
            </label>
            <label htmlFor="height-input">Height
                <input 
                    id="height-input" 
                    type="text" 
                    name="height" 
                    value={height} 
                    onChange={(event) => setHeight(event.target.value)}/>
                {errors.height && <p>{errors.height}</p>}
            </label>
            <label htmlFor="itching-input">How severe is your itching on average?
                <input 
                    id="itching-input" 
                    type="text" 
                    name="itching" 
                    value={itching}
                    onChange={(event) => setItching(event.target.value)}/>
                {errors.itching && <p>{errors.itching}</p>}
            </label>
            <label htmlFor="cramps-input">How many times per week do you experience muscle cramps?
                <input 
                    id="cramps-input" 
                    type="text" 
                    name="cramps" 
                    value={cramps}
                    onChange={(event) => setCramps(event.target.value)}/>
                {errors.cramps && <p>{errors.cramps}</p>}
            </label>
            <label htmlFor="password-input">Password
                <input 
                    id="password-input" 
                    type="text" 
                    name="password" 
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)}/>
                {errors.password && <p>{errors.password}</p>}
            </label>

            <button type="submit">Submit</button>
            
        </form>
    )
}