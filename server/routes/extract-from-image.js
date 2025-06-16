const express = require('express')
const multer = require('multer')
const path = require('path')
const {exec} = require('child_process')
const axios = require('axios')
const {getLifestyleRecs} = require('./get_recommendations')
const {UserModel} =  require('./database.js')
const imageRoute = express.Router()

let cachedExtractedData = null

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

function fileValidation(req, file, cb) {
    const allowedFileTypes = ['application/pdf']
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('unsupported'), false)
    }
}

const upload = multer({ storage, fileFilter: fileValidation })

imageRoute.post('/pdf', upload.single('pdf'), async (req, res) => {
    console.log('FILE RECEIVED')
    const file = path.join(__dirname, '..', '..', 'server', 'uploads', req.file.filename)
    console.log('Received session:', req.session); // <-- Debugging the session
    console.log('UserData from session:', req.session.user); // <-- Ensure userData is being sent correctly

    if (!req.session.user) {
        return res.status(401).json({ message: 'User is not logged in or session expired' });
    }
    console.log('filepath: ', file)
    try {
        const response = await axios.post(
            'http://localhost:8800/extract-text', 
            { filepath: file }, 
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          )
        
        cachedExtractedData = response.data.text
        console.log('SERVER received: ', cachedExtractedData)
        console.log(req.session, req.headers.cookie)
        return res.status(200).json({data: cachedExtractedData})
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Failed'})
    }

})

imageRoute.post('/get-diagnosis', async(req, res) => {
    const {allergies, comorbidities} = req.body
    console.log('RECEIVED DATA: ', allergies, comorbidities)

    const BMI = req.session.user.BMI
    const itching = req.session.user.itching
    const cramps = req.session.user.cramps

    userData = {'BMI': BMI, 'Itching': itching, 
                'MuscleCramps': cramps}
    const numericValues = Object.fromEntries(
        Object.entries(cachedExtractedData).map(([key, value]) => [key, parseFloat(value)]))

    const predictionData = {...userData, ...numericValues}
    console.log(predictionData)

    try {
        const response = await axios.post('http://localhost:8801/detect-ckd', 
            {data: predictionData},{headers: {'Content-Type' :'application/json'}})
        
        const preditedOutcome = response.data.prediction
        console.log(preditedOutcome)

            try {
                if (preditedOutcome === 1){
                    const diagnosis = 'Positive'
                    const profile = {...predictionData, 
                                    ...diagnosis, 
                                    allergies: allergies,
                                    comorbidities: comorbidities}
                    console.log(profile)
                    const content = await getLifestyleRecs(profile)

                    console.log(content)
                    const updateDiagnosis = await UserModel.findByIdAndUpdate(
                        req.session.user._id, 
                        {diagnosis: diagnosis,
                        recommendation: content}
                    )
                    console.log('Updated User: ', updateDiagnosis)
                    return res.status(200).json({diagnosis: diagnosis, recommendations: content})
                }
                else if (preditedOutcome === 0) {
                    const diagnosis = {diagnosis: 'Negative'}
                    return res.status(200).json({diagnosis: diagnosis, recommendations: 'None'})
                }
            } catch (err) {
                console.log('ERROR from Lifestyle recs: ', err)
            }
    } catch (err) {
        console.log('ERROR for detect-ckd microservise: ', err)
    }   
    
})

module.exports = { imageRoute }