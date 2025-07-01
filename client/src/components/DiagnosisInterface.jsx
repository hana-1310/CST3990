import { useNavigate, Link } from "react-router-dom"
import { Fragment,  useState } from "react"
import axios from "axios"

export default function Diagnosis(props) {
    const navigate = useNavigate()
    // retrieves pdf file stored in session management
    const uploadFile = sessionStorage.getItem("uploadFile")
    const extractedValues = JSON.parse(sessionStorage.getItem("extractedValues"))

    const [allergies, setAllergies] = useState([]);
    const [allergyInputText, setAllergyInputText] = useState('');

    const [otherComorbidities, setOtherComorbidities] = useState([])

    // POST request to backend to conduct CKD diagnosis and get recs
    async function handleClick() {
        console.log('Client TEST: ', allergies, otherComorbidities)
        const response = await axios.post('http://localhost:8080/extract/get-diagnosis', 
            {allergies: allergies, comorbidities: otherComorbidities} , 
            {withCredentials: true})
        if (response.status === 200) {
            const diagnosis = response.data.diagnosis
            const recommendations = response.data.recommendations
            navigate('/recommendations', {state: {diagnosis: diagnosis, recs: recommendations}})
            console.log(diagnosis, recommendations)
        } else {
            console.log(err)
        }
    }
    // display for data extracted from pdf
    function displayExtractedValues() {
        return Object.entries(extractedValues).map(([key, value]) => (
            <div className="result-line">
                <span className="label">
                    {key}:
                </span>
                <span className="value">{value}</span>
            </div>
            
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
            <div className="text-extract-container">
                <iframe
                    src={uploadFile}
                    width="40%"
                    height="600px"
                    title="PDF Viewer">
                </iframe>
                <div className="bloodtests">
                    <h2>Extracted</h2>
                    <h2>Blood Tests</h2>
                    <h2>Values</h2>
                    <div className="values">
                        {displayExtractedValues()}
                    </div>
                </div>
                <div className="vertical-line"></div> 
                <div className="additional-info">
                    <label htmlFor="" className="allergies">ENTER ALLERGIES (IF ANY)
                        <input 
                            type="text"
                            name="allergies"
                            value={allergyInputText}
                            onChange={handleInputChange}
                            onBlur={handleAllergyBlur}
                        />
                    </label>
                    <label htmlFor="" className="comorbidities">DO YOU HAVE ANY COMORBIDITIES?
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
                    <button onClick={handleClick}>Run Diagnosis</button>
                </div>
            </div>

            
        </Fragment>
    )
}