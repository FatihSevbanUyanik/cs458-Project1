const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../model/user')
const ApiError = require('../utils/ApiError')
const { catchAsync } = require('../utils/ErrorHandling')


const signUp = catchAsync(async (req, res, next) => {
   // parsing body
   const { username, email, password, birthDate, gender } = req.body
   const data = { username, email, password, birthDate, gender }

   // registering user
   const user = await User.create(data)
   if (!user) { 
      return next(new ApiError('User could not be created.', 400))  
   }
      
   // sending response
   res.status(200).json({
      status: 200,
      data: { user }
   })
})


const signIn = catchAsync(async (req, res, next) => {
   // parsing body
   const { emailOrUsername, password } = req.body
   // checking whether email and password exists.
   if (!emailOrUsername || !password) { 
      return next(new ApiError('Please provide password and username.', 403))
   }

   // checking whether user exists in db.
   const user = await User.findOne({ $or: [{email: emailOrUsername}, 
   {username: emailOrUsername}] }).select('+password')
      
   if (!user) { 
      return next(new ApiError('User could not be found.', 404))
   }

   // checking whether the passwords match with each other. 
   const isPasswordCorrect = await User.correctPassword(password, user.password)
   if (!isPasswordCorrect) { 
      return next(new ApiError('Password is wrong.', 404))
   }

   // generating corrsponding JWT token
   const token = User.generateJWT(user._id)

   // sending response
   res.status(200).json({
      status: 200,
      data: { token, user } 
   })

})


// generates password reset token and saves the user.
const forgotPassword = catchAsync(async (req, res, next) => {   
   // parsing the body.
   const email = req.body.email
   const user = await User.findOne({ email })
   
   if (!user) { 
      return next(new ApiError('User not found.', 404))
   }

   // generating token
   const resetToken = user.createPasswordResetToken()
   await user.save()

   // send token
   res.status(200).json({
      status: 200,
      data: {
         resetToken 
      }
   })
})


// resets the password and removes the reset tokens.
const resetPassword = catchAsync(async (req, res, next) => {
   const hashedToken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex')
 
   const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
   })
 
   if (!user)  { 
      return next(new ApiError('Invalid Token', 403))
   }

   user.password = req.body.password
   user.passwordResetToken = undefined
   user.passwordResetExpires = undefined
   await user.save()
 
   res.status(200).json({
      status: 200,
      data: {
         message: 'Password has been changed successfully.' 
      }
   })
})

// exports
module.exports = {
   signUp, signIn, forgotPassword, resetPassword
}