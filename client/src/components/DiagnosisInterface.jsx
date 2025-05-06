import { useLocation, Link } from "react-router-dom"
import { Fragment } from "react"
import axios from "axios"
export default function Diagnosis(props) {
    const location = useLocation()
    const {uploadFile, extractedValues} = location.state 
    // async function handleClick() {
    //     const response = axios.post('http://localhost:8080/get-diagnosis')
    // }
    function displayExtractedValues() {
        return Object.entries(extractedValues).map(([key, value]) => (
            <label htmlFor={key + "-label"} key={key}>
                {key}
                <p id={key + "-label"}>{value}</p>
            </label>
        ))
    }
    
    return (
        <Fragment>
            <div>
                <iframe
                    src={uploadFile}
                    width="40%"
                    height="600px"
                    style={{ border: "1px solid #ccc" }}
                    title="PDF Viewer">
                </iframe>
                <div>
                    {displayExtractedValues()}
                </div>
            </div>

            <Link>Proceed to Diagnosis</Link>
        </Fragment>
    )
}