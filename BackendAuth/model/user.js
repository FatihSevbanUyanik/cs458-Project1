// =====================
// imports
// =====================
const { promisify } = require('util')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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
   }
  
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

// export.
const User = mongoose.model('User', UserSchema)
module.exports = User