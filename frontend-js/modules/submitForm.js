export default class SubmitForm {

    constructor() {
        this.form        = document.querySelector('#contactForm')
        this.timeout     = null
        this.allFields   = null
        this.errors      = []

        this.events()
    }

    // events

    events() {
        // creating space for popovers upon errors
        this.allFields = document.querySelectorAll('.form-element')
        this.allFields.forEach(field => {
            if(field.type === 'radio' && field.value.includes('Ms.')) {
                field.parentElement.insertAdjacentHTML('afterend', `
                    <div class="alert alert-danger small liveValidateMessage"></div>
                `)
            } else if(field.type !== 'radio') {
                field.insertAdjacentHTML('afterend', `
                <div class="alert alert-danger small liveValidateMessage"></div>
            `)
            }
        })
    
        // live validation
        this.allFields.forEach(field => {
            if(field.type === 'radio') {
                field.addEventListener('click', ()=> {
                    this.hideError(field)
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        this.validate(field)
                    }, 500)
                })
            } else if(field.tagName === 'SELECT') {
                field.addEventListener('click', ()=> {
                    this.hideError(field)
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        this.validate(field)
                    }, 500)
                })
            } else {
                field.addEventListener('keydown', () => {
                    this.hideError(field)
                    clearTimeout(this.timeout)
                    this.timeout = setTimeout(() => {
                        this.validate(field)
                    }, 500)
                })
            }
        })

        // Submitting
        this.form.addEventListener('submit', e => {
            e.preventDefault()
            this.errors = []
        
            this.allFields.forEach(field => {
                this.validate(field)
            })
        
            if(!this.errors.length) {
                this.form.submit()
            }
        })
    }

    // methods
    
    showError(element, message) {
        element.nextElementSibling.innerHTML = message
        element.nextElementSibling.classList.add("liveValidateMessage--visible")
    }
    
    hideError(element) {
        element.nextElementSibling.classList.remove("liveValidateMessage--visible")
        this.timeout = setTimeout(() => {
            element.nextElementSibling.innerHTML = ""
        }, 300)
    }
    
    validate(element) {
        let value = element.value
        let name = element.name
        
        if(name === "firstName") {
            if(value.length < 3 && value.length !== 0) {
                this.showError(element, "First name has to be at least 3 characters long.")
                this.errors.push("First Name")
            } 
            else if(value.length === 0) {
                this.showError(element, "You must provide your first name.")
                this.errors.push("First Name")
            }
            else if(value.length > 20) {
                this.showError(element, "First name cannot exceed 20 characters.")
                this.errors.push("First Name")
            }
            else {
                if(!/^[A-Za-z]+$/.test(value)) {
                    this.showError(element, "First name can only contain letters.")
                    this.errors.push("First Name")
                } else {
                    this.hideError(element)
                }
            }
        }
    
        if(name === "lastName") {
            if(value.length < 3 && value.length !== 0) {
                this.showError(element, "Last name has to be at least 3 characters long.")
                this.errors.push("Last Name")
            } 
            else if(value.length === 0) {
                this.showError(element, "You must provide your last name.")
                this.errors.push("Last Name")
            }
            else if(value.length > 30) {
                this.showError(element, "Last name cannot exceed 30 characters.")
                this.errors.push("Last Name")
            }
            else {
                if(!/^[A-Za-z]+$/.test(value)) {
                    this.showError(element, "Last name can only contain letters.")
                    this.errors.push("Last Name")
                } else {
                    this.hideError(element)
                }
            }
        }
    
        if(name === "email") {
            if(!/^\S+@\S+$/.test(value) && value.length > 0) {
                this.showError(element, "You must provide a valid email address.")
                this.errors.push("Email")
            }
            else if(value.length === 0) {
                this.showError(element, "You must provide your e-mail address.")
                this.errors.push("Email")
            }
            else {
                this.hideError(element)
            }
        }
    
        if(name === "phone") {
            let phoneno = /^\+?([0-9]{5})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;
            if(!value.match(phoneno)) {
                this.showError(element, "You must provide a valid phone number.")
                this.errors.push("Phone")
            } else {
                this.hideError(element)
            }
        }
    
        if(name === "category") {
            if(value === "DEFAULT") {
                this.showError(element, "You must choose a category of your problem.")
                this.errors.push("Category")
            } else {
                this.hideError(element)
            }
        }
        
        if(name === "personTitle") {
            let checks = 0
            document.getElementsByName('personTitle').forEach(field => {
                if(field.checked) {checks++}
            })
            if(checks === 0) {
                this.showError(element.parentElement, "You must choose a title")
                this.errors.push("personTitle")
            } else {
                this.hideError(element.parentElement)
            }
        }
    }
}