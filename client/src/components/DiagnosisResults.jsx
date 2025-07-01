import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

// diagnosis and recs display
export default function ShowRecommendations() {
    const location = useLocation()
    const diagnosis = location.state?.diagnosis
    const recommendations = location.state?.recs

    return (
        <div className="diagnosis-container">
            <h2 className="diagnosis-title">Your CKD Risk Assessment</h2>
            { diagnosis === 'Positive' ? 
                <div>
                    <p className="prognostic">Based on your blood test report, 
                        you are showing signs consistent with Chronic Kidney Disease.</p>
                    <div><h2>What can be done to improve your quality of life and curb progression:</h2>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} children={recommendations}/>
                    </div>
                </div>
                : 
                <div>
                    <p className="prognostic">YGreat news! Your kidney function appears to be within the normal range. </p>
                    <div>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} children={recommendations}/>
                    </div>
                </div>}
                
        </div>
    )
}