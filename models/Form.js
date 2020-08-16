const sendgrid = require('@sendgrid/mail')
const dotenv = require('dotenv')
dotenv.config()

// getting API KEY included in .env file inside main folder (private and protected at all cost)
sendgrid.setApiKey(process.env.SENDGRIDAPIKEY) 

let Form = function(data) {
    this.data = {
        title: data.personTitle,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        category: data.category,
        details: data.details
    }

    this.errors = []
}

Form.prototype.cleanUp = function () {
    // cleaning up malicious inputs, attributes and tags
    const {firstName, lastName, email, phone, category, details, title} = this.data
    if(typeof(firstName) !== 'string') {this.data.firstName = ''}
    if(typeof(lastName) !== 'string') {this.data.lastName = ''}
    if(typeof(email) !== 'string') {this.data.email = ''}
    if(typeof(phone) !== 'string') {this.data.phone = ''}
    if(typeof(category) !== 'string') {this.data.category = ''}
    if(typeof(details) !== 'string') {this.data.details = ''}
    if(typeof(title) !== 'string') {this.data.title = ''}

    console.log("Inputs have been cleaned up.")
}

Form.prototype.validate = function () {
    // back-end validation in case a malicious user got through front-end validation

    const {firstName, lastName, email, phone, category, title} = this.data

    if(firstName.length < 3 && firstName.length !== 0) {this.errors.push("First name has to be at least 3 characters long.")} 
    else if(firstName.length === 0) {this.errors.push("You must provide your first name.")}
    else if(firstName.length > 20) {this.errors.push("First name cannot exceed 20 characters.")}
    else if(!/^[A-Za-z]+$/.test(firstName)) {this.errors.push("First name can only contain letters.")}

    if(lastName.length < 3 && lastName.length !== 0) {this.errors.push("Last name has to be at least 3 characters long.")} 
    else if(lastName.length === 0) {this.errors.push("You must provide your last name.")}
    else if(lastName.length > 30) {this.errors.push("Last name cannot exceed 30 characters.")}
    else if(!/^[A-Za-z]+$/.test(lastName)) {this.errors.push("Last name can only contain letters.")}

    if(!/^\S+@\S+$/.test(email) && email.length > 0) {this.errors.push("You must provide a valid email address.")}
    else if(email.length === 0) {this.errors.push("You must provide your e-mail address.")}

    let phoneno = /^\+?([0-9]{5})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
    if(!phone.match(phoneno)) {this.errors.push("You must provide a valid phone number.")}

    if(category === "DEFAULT") {this.errors.push("You must choose a category of your problem.")}

    if(title === '') {this.errors.push("You must choose a title")}
    console.log("Inputs validation successful.")
}

Form.prototype.sendMail = function() {
    return new Promise ((resolve, reject) => {
        console.log("Sending an e-mail..")
        sendgrid.send({
            to: `${this.data.email}`,
            from: 'lukpro95@gmail.com',
            subject: `Thank you for your submission, ${this.data.title} ${this.data.firstName} ${this.data.lastName}!`,
            text: `
                Dear ${this.data.title} ${this.data.firstName} ${this.data.lastName}! 
    
                Thank you for submitting the contact form. This message confirms your submission. 
                One of our engineers will be in touch with you as soon as possible!
    
                Your submission: 
                Problem: ${this.data.category}
                Details: ${this.data.details}

                Your phone contact: ${this.data.phone}
    
                Kind regards,
                TechService
            `,
            html: `
            Dear <strong>${this.data.title} ${this.data.firstName} ${this.data.lastName}</strong>!  
                <br /><br />
                Thank you for submitting the contact form. This message confirms your submission. <br />
                One of our engineers will be in touch with you shortly!
                <br /><br />
                Your submission:<br />
                Problem: ${this.data.category}<br />
                Details: ${this.data.details}

                <br /></br>
                Your phone contact: ${this.data.phone}

                <br /><br />
                Kind regards, <br />
                TechService
            `
        })
        .then(() => {
            resolve()
        })
        .catch((error) => {
            reject()
        })
    })
}

Form.prototype.submitForm = function() {
    return new Promise ((resolve, reject) => {

        this.cleanUp()
        this.validate()

        console.log(this.errors)

        if(!this.errors.length) {
            this.sendMail()
            .then(() => {
                resolve("Successfully submitted and sent an email.")
            })
            .catch(() => {
                reject("Something went wrong trying to send an email. Try again later.")
            })
        } else {
            reject(this.errors)
        }
    })
}

module.exports = Form