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
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true });
            
            if (response.status === 200) {
                const data = response.data.data
                console.log("Navigating with data:", preview, data)
                sessionStorage.setItem("uploadFile", preview)
                sessionStorage.setItem("extractedValues", JSON.stringify(data))
                navigate('/diagnosis')
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
        <div className="landing-page">
            <div className="first-container">
                <div className="ckd-description">
                    <h1>What is Chronic Kidney Disease?</h1>
                    <p>
                        Chronic Kidney Disease (CKD) is a long-term condition 
                        where the kidneys gradually lose function over time. 
                        It progresses through five 
                        stages, with Stage 5 being end-stage renal disease. CKD may not 
                        show symptoms in early stages, making regular screening 
                        important.
                    </p>
                    <p>
                        Left untreated, 
                        it can lead to serious complications such as heart disease. 
                        Managing CKD involves controlling 
                        lifestyle changes and medication.
                    </p>
                </div> 
                <div className="pdf-upload">
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
                        <input type="file" id="file-input" name="pdf" onChange={fileChange} />
                        <label htmlFor="file-input">Upload PDF to start Diagnosis</label>
                        <button type="submit">Submit</button>
                    </form>                
                </div>
            </div>
            <div className="second-container">

            </div>

        </div>
    )
}