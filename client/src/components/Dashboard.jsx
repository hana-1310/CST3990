import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function DisplayProfile() {
    const navigate = useNavigate()
    const [userProfile, setUserProfile] = useState(null)

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/database/profile', {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setUserProfile(response.data.data)
                    console.log(response.data.data)
                }
            } catch (err) {
                console.error(err)
            }
        }

        getProfile()
    }, [])

    function handleClick() {
        navigate('/recommendations',  {state: {diagnosis: userProfile.diagnosis, recs: userProfile.recommendation}})
    }
    return (
        <div className='dashboard-container'>
            {userProfile ? (
                <div className='main-container'>
                    <div className='recommendations-container'>
                        <h2 className='personal-title'>Personal Diagnosis</h2>
                        <h2 className='personal-title'>and Advice</h2>
                        <div className='recs-title'>Recommendations</div>
                        { !userProfile.diagnosis ? <span>No Diagnosis to show</span> : 
                        <button onClick={handleClick}>View Previous Diagnosis and Advice</button>}
                    </div>
                    <div className='user-details-container'>
                        <span className='value'>{userProfile.height}</span>
                        <span className='label'>HEIGHT</span>
                        <span className='value'>{userProfile.weight}</span>
                        <span className='label'>WEIGHT</span>
                        <span className='value'>{userProfile.BMI}</span>
                        <span className='label'>BMI</span>
                    </div>
                    <div className='user-name'>
                        <h2>{userProfile.username}</h2>
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    )
}
