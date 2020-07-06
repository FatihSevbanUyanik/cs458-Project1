// =====================
// imports
// =====================
const User = require('./model/user')
const mongoose = require('mongoose')
const express = require('express')
const { json } = require('express')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })
const app = express()
app.use(json())

// =====================
// methods 
// =====================
const sendErrorResponse = (res, message, status) => {
   res.status(status).json({ status, data: { message } })
}

// =====================
// routes
// =====================

app.post('/auth/signup', async (req, res) => {
   try {
      // parsing body
      const { username, email, password, birthDate, gender } = req.body
      const passwordHashed = await bcrypt.hash(password, 10)
      const data = { username, email, password: passwordHashed, birthDate, gender }
      
      // registering user
      const user = await User.create(data)
      if (!user) { 
         return sendErrorResponse(res, 'User could not be created.', 400) 
      }
      
      // sending response
      res.status(200).json({
         status: 200,
         data: { user }
      })

   } 
   // error
   catch(error) {
      res.status(400).json({
         status: 400,
         data: { error } 
      })
   } 
})


app.post('/auth/signin', async (req, res) => {

   try {

      // parsing body
      const { emailOrUsername, password } = req.body

      // checking whether email and password exists.
      if (!emailOrUsername || !password) { 
         return sendErrorResponse(res, 'Please provide password and username.', 403) 
      }

      // checking whether user exists in db.
      const user = await User.findOne({ $or: [{email: emailOrUsername}, 
         {username: emailOrUsername}] }).select('+password')
      
      if (!user) { 
         return sendErrorResponse(res, 'User could not be found.', 404) 
      }

      // checking whether the passwords match with each other. 
      const isPasswordCorrect = await User.correctPassword(password, user.password)
      if (!isPasswordCorrect) { 
         return sendErrorResponse(res, 'Password is wrong.', 404) 
      }

      // generating corrsponding JWT token
      const token = User.generateJWT(user._id)

      res.status(200).json({
         'status': '200',
         'data': { token, user } 
      })

   } catch (error)  {
      res.status(400).json({
         status: 400,
         data: { error } 
      })
   }
})


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