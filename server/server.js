/**npm run devStart runs all the code in server.js then waits for any changes */
/**create express server */
const {ConnectDatabase, databaserouter, verifyToken} = require('./routes/database.js')
const {diagnosisRoute} = require('./routes/diagnosis.js')

const express = require("express")
const bodyParser = require('body-parser')
const session = require('express-session')


const cors = require("cors")
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    allowedHeaders: [
        'set-cookie',
        'Content-Type',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials'
    ]
}

const app = express()
// Middleware


app.use(bodyParser.json())
/** get server to run and app is listineing on port 3000 for a bunch of requests 
 * second parameter of get is a function that takes request, response
 * to create a vite-express app
 * put them in seperate folders
 * in server folder run npm init -y to get package json for sevrer
 * npm i express
 * npm i --save-dev nodemon
 * configure backend to accept req from frontend sever
 * npm i cors
 * npm install axios on client
*/


app.use(cors(corsOptions))

app.use(session({
    secret: 'your-secret-key',      
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,              // true if using HTTPS
        maxAge: 1000 * 60 * 60      // 1 hour session lifetime
    }
}))

const vitaGuideDB = new ConnectDatabase('mongodb+srv://root:1234@ckd-app.rktvud5.mongodb.net/vitaguide?retryWrites=true&w=majority&appName=ckd-app')

app.use('/database', databaserouter)
app.use('/extract', diagnosisRoute)


app.get('/autoLogin', (req, res) => {
    const cookie = req.headers.cookie

    if (!cookie || cookie === null) {
        return res.status(401).json({message: 'No cookies'})
    }

    const decoded = verifyToken(cookie)

    if (!decoded) {
        return res.status(401).json({message: 'Invalid token'})
    }

    return res.status(200).json({username: decoded.username})
})

app.get('/logout', (req, res) => {
    console.log('Before clearing cookies:', req.cookies)

    res.clearCookie('authToken', { path: '/' })

    console.log('After clearing cookies:', req.cookies)
    return res.status(200).json({message: 'User was logged out'})
})



app.listen(8080, () => {
    console.log("Server started on PORT 8080")
})
