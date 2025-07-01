import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"
import axios from "axios"
import CKDTests from "../../public/data/ckd-tests.json"
// main page
export default function LandingPage() {
    const {userContext, setUserContext} = useContext(isUserLoggedIn)
    const [uploadFile, setUploadFile] = useState(null)
    const [preview, setPreviewURL] = useState(null)
    const [toggleInfo, setToggleInfo] = useState(false)
    const [tests, setTests] = useState([]);

    useEffect(() => {
        setTests(CKDTests);
    }, []);

    const navigate = useNavigate()
    
    function fileChange(event) {
        const file = event.target.files[0]

        if (file && file.type === 'application/pdf') {
                setUploadFile(file)
        } else {
            alert('Please select a valid file format (PDF only)')
        }
    }

    // POST request to backend to begin data extraction from pdf
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
            if (err.response && err.response.status === 500) {
                console.log(err.response.data.message)
                alert(err.response.data.message)
            } else {
                console.log(err.error)
            }
            
        }        
    }
    function handleToggle() {
        setToggleInfo(prev => !prev)
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
                        {userContext.username ? (
                            <>
                                <label htmlFor="file-input">Choose a file:</label>
                                <input 
                                    type="file" 
                                    id="file-input"
                                    name="pdf"
                                    onChange={fileChange}
                                />
                                <button type="submit">Upload & Diagnose</button>
                            </>
                        ) : (
                            <>
                                <h3>Choose a file:</h3>
                                <button 
                                    type="button" 
                                    onClick={() => alert('Please sign in to access the diagnosis feature')}
                                >
                                    Upload
                                </button>
                            </>
                            
                        )}
                    </form>
                            
                </div>
            </div>
            <div className="second-container">
                <button className="readmore" onClick={handleToggle}>{toggleInfo ? 'READ LESS' : 'READ MORE'}</button>
                {toggleInfo && 
                    (<div className="test-container">
                        <h1 className="test-heading">
                            🧪 Required Blood Tests for CKD Diagnosis
                        </h1>

                        {tests.map((group, index) => (
                            <div key={index} className="test-key">
                            <h2 className="group">{group.group}</h2>
                            <div className="test-no">
                                {group.tests.map((test, idx) => (
                                <div
                                    key={idx}
                                    className="border rounded-lg p-4 shadow-sm bg-white"
                                >
                                    <h3 className="test-name">{test.name}</h3>
                                    <p className="test-description">{test.description}</p>
                                    <p className="test-range">
                                    <strong>Normal Range:</strong> {test.normalRange}
                                    </p>
                                </div>
                                ))}
                            </div>
                            </div>
                        ))}
                        </div>)
                }
            </div>

        </div>
    )
}