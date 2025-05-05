import { useLocation, Link } from "react-router-dom"
import { Fragment } from "react"
import axios from "axios"
export default function Diagnosis(props) {
    const location = useLocation()
    const {uploadImage} = location.state 
    // async function handleClick() {
    //     const response = axios.post('http://localhost:8080/get-diagnosis')
    // }
    return (
        <Fragment>
            <div>
                <iframe
                    src={uploadImage}
                    width="40%"
                    height="600px"
                    style={{ border: "1px solid #ccc" }}
                    title="PDF Viewer">
                </iframe>
                <div>

                </div>
            </div>

            <Link>Run Diagnosis</Link>
        </Fragment>
    )
}