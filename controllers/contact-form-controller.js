const Form = require('../models/Form.js')

exports.submitForm = (req, res) => {
    let form = new Form(req.body)

    form.submitForm()
    .then((success) => {
        console.log("Success")
        res.render('status', {name: req.body.firstName, status: 'success', success})
    })
    .catch((errors) => {
        console.log("Errors")
        res.render('status', {status: 'errors', errors})
    })
}