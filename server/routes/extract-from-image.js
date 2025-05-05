const express = require('express')
const multer = require('multer')
const imageRoute = express.Router()

const storage = multer.memoryStorage()

function fileValidation(req, file, cb) {
    const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg']
    cb(null, allowedFileTypes.includes(file.mimetype))
}

const upload = multer({ storage, fileValidation })

imageRoute.post('/', upload.single('image'), (req, res) => {
    const image = req.file;
    if (!image) {
        return res.status(400).json({message: 'No file uploaded'})
    }

    console.log(image)
    res.json({message: 'Image received'})
})

module.exports = { imageRoute }