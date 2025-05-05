const express = require('express')
const multer = require('multer')
const path = require('path')
const {exec} = require('child_process')
const imageRoute = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

function fileValidation(req, file, cb) {
    const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('unsupported'), false)
    }
}

const upload = multer({ storage, fileValidation })

imageRoute.post('/pdf', upload.single('pdf'), (req, res) => {
    console.log('FILE RECEIVED')
    const file = path.join(__dirname, '..', '..', 'server', 'uploads', req.file.filename)
    const pythonscript = path.join(__dirname, '..', '..', 'server', 'python-scripts', 'extract_text.py')
    console.log(file)
    exec(`python "${pythonscript}" "${file}"`, (err, stdout, stderr) => {
        if (err) {
            console.log("Python error: ", stderr)
            return res.status(500).json({error: 'OCR FAILED'})
        }

        const output = stdout.match(/{[^}]*}/s);
        console.log(output[0])


        try {
            const result = JSON.parse(output[0]) 
            res.status(200).json({ extracted: result })
        } catch (err) {
            console.log('FAILED TO PARSE JSON', err)
            res.status(500).json({ error: 'Invalid JSON format' })
        }
    })
})

module.exports = { imageRoute }