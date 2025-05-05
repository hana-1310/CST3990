import { Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { isUserLoggedIn } from "../contexts/UserLoggedIn"

export default function LandingPage() {
    const {userContext, setUserContext} = useContext(isUserLoggedIn)
    const [uploadImage, setUploadImage] = useState(null)
    const [preview, setPreviewURL] = useState(null)
    function fileChange(event) {
        const file = event.target.files[0]

        if (file && file.type === 'application/pdf' || 
            file && file.type === 'application/png') {
                setUploadImage(file)
        } else {
            alert('Please slect a valid file')
        }
    }
    function handleSubmit(event) {
        event.preventDefault()
        // const formData = new FormData()
        // formData.append('image', )
        

    }

    useEffect(() => {
        if (uploadImage) {
            const objectUrl = URL.createObjectURL(uploadImage)
            setPreviewURL(objectUrl)

            return () => URL.revokeObjectURL(objectUrl)
            
        }
    }, [uploadImage])

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
                    state={{uploadImage: preview}}
                    onClick={(e)=> {
                        if (!userContext.username) {
                            e.preventDefault()
                            alert('Please sign in to trigger your diagnosis')
                        }
                    }}>Upload</Link> */}
                    <input type="file" onChange={fileChange} />
                    <Link to='/diagnosis' state={{uploadImage: preview}}>Upload</Link>

                </form>                
            </div>
        </div>
    )
}