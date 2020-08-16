const express = require('express')
const router = express.Router()
const contactFormController = require('./controllers/contact-form-controller')


router.get('/', (req,res) => {res.render('contact-form')})
router.post('/sendForm', contactFormController.submitForm)

module.exports = router