import { useLocation, Link } from "react-router-dom"
import { Fragment, useState } from "react"
import axios from "axios"
export default function Diagnosis(props) {
    const location = useLocation()
    const uploadFile = sessionStorage.getItem("uploadFile")
    const extractedValues = JSON.parse(sessionStorage.getItem("extractedValues"))

    const [allergies, setAllergies] = useState([]);
    const [allergyInputText, setAllergyInputText] = useState('');

    const [otherComorbidities, setOtherComorbidities] = useState([])

    async function handleClick() {
        console.log('Client TEST: ',allergies, otherComorbidities)
        const response = await axios.post('http://localhost:8080/extract/get-diagnosis', 
            {allergies: allergies, comorbidities: otherComorbidities} , 
            {withCredentials: true})
        if (response.status === 200) {
            console.log('YES')
        } else {
            console.log(err)
        }
    }
    function displayExtractedValues() {
        return Object.entries(extractedValues).map(([key, value]) => (
            <label htmlFor={key + "-label"} key={key}>
                {key}
                <p id={key + "-label"}>{value}</p>
            </label>
        ))
    }
    function handleInputChange(event) {
        setAllergyInputText(event.target.value);
    }
    
    function handleAllergyBlur() {
        const parsed = allergyInputText
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        setAllergies(parsed);
    }
    

    function handleChange(event) {
        const input = event.target.value 
        setOtherComorbidities(prevState => 
            event.target.checked ? [...prevState, input] : prevState.filter(item => item !== input)
        )
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
                <div>
                    <label htmlFor="">Allergies (if any)
                        <input 
                            type="text"
                            name="allergies"
                            value={allergyInputText}
                            onChange={handleInputChange}
                            onBlur={handleAllergyBlur}
                        />
                    </label>
                    <label htmlFor="">Comorbidities
                        <input 
                            type="checkbox"
                            name="comorbidity"
                            value="Cardiovascular Disease"
                            id="cardiovascular"
                            checked={otherComorbidities.includes("Cardiovascular Disease")}
                            onChange={handleChange}
                        />
                        <label htmlFor="cardiovascular">Cardiovascular Disease</label>
                        <input 
                            type="checkbox"
                            name="comorbidity"
                            value="Diabetes"
                            id="diabetes"
                            checked={otherComorbidities.includes("Diabetes")}
                            onChange={handleChange}
                        />
                        <label htmlFor="diabetes">Diabetes</label>
                    </label>
                </div>
            </div>

            <button onClick={handleClick}>Run Diagnosis & Get Recommendation</button>
        </Fragment>
    )
}