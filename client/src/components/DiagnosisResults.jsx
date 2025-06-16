// import ReactMarkdown from "react-markdown"
// import remarkGfm from "remark-gfm"
import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function ShowRecommendations() {
    const location = useLocation()
    const diagnosis = location.state?.diagnosis
    const recommendations = location.state?.recs

    return (
        <div>
            <h2>Diagnosis Results</h2>
            { diagnosis === 'Positive' ? 
                <div>
                    <p>You have CKD</p>
                    <div>Recommendations:
                        <p>{recommendations}</p>
                    </div>
                </div>
                : 
                <p>You do not have CKD</p>}
        </div>
    )
}