import SubmitForm from './modules/submitForm'

if(document.querySelector("#contactForm")) {
    new SubmitForm()
}

if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
}