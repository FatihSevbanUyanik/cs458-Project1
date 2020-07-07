// =====================
// imports
// =====================
const dotenv = require('dotenv')
const express = require('express')
const { json } = require('express')
const mongoose = require('mongoose')
const routesAuth = require('./routes/routesAuth')
const { globalErrorHandler } = require('./utils/ErrorHandling')

dotenv.config({ path: './config.env' })
const app = express()
app.use(json())

// =====================
// routes
// =====================
app.use('/auth', routesAuth)
app.use(globalErrorHandler)

// ============================
// DATABASE CONNECTION
// ============================
mongoose.connect(process.env.DATA_BASE_CONNECTION, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   useUnifiedTopology: true
}).then(result => {
   console.log('DB connection successful')
}).catch(error => {
   console.error(error)
})


// ============================
// SERVER CONNECTION
// ============================
const serverPort = process.env.PORT
app.listen(serverPort, () => {
   console.log(`Server running on Port ${serverPort}`)
})