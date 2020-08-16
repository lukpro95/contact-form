const express = require('express')
const app = express()
const router = require('./router')
const dotenv = require('dotenv')
const cors = require('cors')

app.use(cors())

app.use(express.urlencoded({extended: false})) // accepting html form submit
app.use('/', router)

app.use('/public', express.static('./public'))

// configure express here to see a page from ejs
app.set('views', 'views') // where to look for template
app.set('view engine', 'ejs') // which engine for the template

app.use((req, res, next) => {
    res.render('page404');
});

dotenv.config()

app.listen(process.env.PORT, () => {
    console.log("Connected")
})

module.exports = app