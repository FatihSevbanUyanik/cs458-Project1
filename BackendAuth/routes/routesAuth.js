// =====================
// imports
// =====================
const express = require('express')
const routerAuth = express.Router()


// =====================
// methods
// =====================
const { signUp, signIn, forgotPassword, resetPassword } = require('../controller/controllerAuth')


// =====================
// routes
// =====================
routerAuth.post('/forgotPassword', forgotPassword)
routerAuth.patch('/reset-password', resetPassword)
routerAuth.post('/signup', signUp)
routerAuth.post('/signin', signIn)
module.exports = routerAuth