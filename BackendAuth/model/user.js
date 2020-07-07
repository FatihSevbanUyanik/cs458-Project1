// =====================
// imports
// =====================
const { promisify } = require('util')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const Schema = mongoose.Schema


// =====================
// Schema
// =====================
const UserSchema = new Schema({
   username: {
      type: String,
      unique: [true, 'Username needs to be unique'],
      required: [true, 'You should have a username.'],
      trim: true
   },  
   email: {
      type: String,
      unique: [true, 'Email needs to be unique'], 
      required:  [true, 'You should have an email.'],
   },
   password: {
      required:  [true, 'You should provide a password.'],
      type: String,
      trim: true,
      minlength: 8,
      select: false
   },
   birthDate: {
      required:  [true, 'You should provide a birth date.'],
      type: String,
      trim: true,
   },
   gender: {
      type: String,
      enum: ['Man', 'Woman', 'Other'],
      trim: true,
      required: [true, 'You should provide gender.']
   },
   passwordResetToken: String,
   passwordResetExpires: Date
  
}, {timestamps: false, versionKey: false})


// =====================
// methods
// =====================

// Not reflecting password in result object.
UserSchema.methods.toJSON = function () {
   const userObject = this.toObject()
   delete userObject.password
   return userObject
}

UserSchema.pre('save', async function(next) {
   // changing password
   if (!this.isModified('password')) return next()
   this.password = await bcrypt.hash(this.password, 10)
   next()
})

// checking whether the hashed password matches 
UserSchema.statics.correctPassword = async (candidate, encrypted) => {
   return await bcrypt.compare(candidate, encrypted)
}

// generates JWT
UserSchema.statics.generateJWT = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

// decodes JWT
UserSchema.statics.decodeJWT = async token => {
   return await promisify(jwt.verify)(token, process.env.JWT_SECRET)
}

// generates hashed password  reset token.
UserSchema.methods.createPasswordResetToken = function() {
   // generate reset token 
   const resetToken = crypto.randomBytes(32).toString('hex')
 
   // hash the token
   this.passwordResetToken = crypto
     .createHash('sha256')
     .update(resetToken)
     .digest('hex')
 
   // setup expiration date of reset token.
   this.passwordResetExpires = Date.now() + 10 * 60 * 1000
   return resetToken
}

// export.
const User = mongoose.model('User', UserSchema)
module.exports = User