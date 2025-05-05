const express = require('express');
const mongoose = require('mongoose')
const jsonwebtoken = require('jsonwebtoken')
const databaserouter = express.Router()

class ConnectDatabase {
    constructor(URL) {
        mongoose.set("strictQuery", false)
        mongoose.connect(URL).then(() => {
            console.log('Connection has successfully been established to MONGODB Atlas')
        }).catch(err => {
            console.log('Unsuccessful Connection: ', err)
        })
    }
}

const userSchema = new mongoose.Schema({
    username: String,
    age: Number,
    password: String,
    BMI: Number,
    Itching: Boolean,
    MuscleCramps: Boolean
})

const UserModel = mongoose.model('User', userSchema)

databaserouter.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const { username, age, password, BMI } = req.body
        const existingUser = await UserModel.find({username: username})

        if (existingUser.length > 0) {
            console.log("SERVER: Username is taken")
            return res.status(500).json({message: "Username is taken"})
        } else {
            const newUser = UserModel({ username, age, password, BMI })
            await newUser.save()
            console.log("SERVER: User creation was a success")
        }

        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error creating user" })
    }

})

databaserouter.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        const existingUser = await UserModel.findOne({username: username, password: password})
        if (!existingUser) {
            console.log('SERVER: Invalid credentials')
            return res.status(500).json({message: 'Invalid credentials. Try again'})
        } else {
            const authToken = jsonwebtoken.sign({username, password}, 'DUMMYKEY')
            res.cookie('authToken', authToken, {
                path: '/',
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            console.log('SERVER: User logged in')
            res.status(200).json({message: 'User logged in', 
                                    username: username})
        }
        
    } catch (err) {
        res.status(500).json({error: err})
    }
    
})

function verifyToken(token) {
    try {
        return jsonwebtoken.verify(token, 'DUMMYKEY')
    } catch (err) {
        console.log(err)
    }
}

module.exports = {ConnectDatabase, databaserouter, verifyToken}