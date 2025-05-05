import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import axios from "axios"

export default function LandingPage() {
    const {userContext, setUserContext} = useContext(isUserLoggedIn)
    const [uploadFile, setUploadFile] = useState(null)
    const [preview, setPreviewURL] = useState(null)
    const navigate = useNavigate()
    function fileChange(event) {
        const file = event.target.files[0]

        if (file && file.type === 'application/pdf' || 
            file && file.type === 'image/png') {
                setUploadFile(file)
        } else {
            alert('Please slect a valid file')
        }
    }
    async function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData()
        formData.append('pdf', uploadFile)
        console.log(formData)
        
        try {
            const response = await axios.post('http://localhost:8080/extract/pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }})
            if (response.status === 200) {
                console.log(response.data.extracted)
                navigate('/diagnosis', {state: {uploadFile: preview}})
            } 
        } catch (err) {
            console.log(err.error)
        }

        

    }

    useEffect(() => {
        if (uploadFile) {
            const objectUrl = URL.createObjectURL(uploadFile)
            setPreviewURL(objectUrl)

            return () => URL.revokeObjectURL(objectUrl)
            
        }
    }, [uploadFile])

    return (
        <div>
            <div>
                <p>
                    To check for kidney disease, health care providers use
                    a blood test that checks how well your kidneys are filtering 
                    your blood, called GFR. GFR stands for glomerular filtration rate.
                    a urine test to check for albumin. Albumin is a protein that 
                    can pass into the urine when the kidneys are damaged.
                    If you have kidney disease, your health care provider will use 
                    the same two tests to help monitor your kidney disease and 
                    make sure your treatment plan is working.
                </p>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    {/* {userContext.username ? 
                    <input 
                        type="file" 
                        onChange={fileChange}
                    /> :
                    null}
                    <Link 
                    to='/diagnosis' 
                    state={{uploadFile: preview}}
                    onClick={(e)=> {
                        if (!userContext.username) {
                            e.preventDefault()
                            alert('Please sign in to trigger your diagnosis')
                        }
                    }}>Upload</Link> */}
                    <input type="file" name="pdf" onChange={fileChange} />
                    <button type="submit">Submit</button>

                </form>                
            </div>
        </div>
    )
}