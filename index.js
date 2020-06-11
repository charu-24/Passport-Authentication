require('dotenv').config()

const express= require('express')
const expressLayouts = require('express-ejs-layouts')
const authRoutes = require('./routes/auth')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');
const userRoutes = require('./routes/app')
const app= express()

//passport config
require("./config/passport")(passport)

//DB CONNECTION
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => console.log("DB CONNECTED"))
.catch((err) => console.log(err))

//middleware
app.use(expressLayouts)
app.set('view engine', 'ejs')
// app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }))
//express session layer

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,

}))


//passport init
app.use(passport.initialize())
app.use(passport.session())

//Connect Flash
app.use(flash())

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.errors_msg = req.flash('errors_msg')
    res.locals.error = req.flash('error')
    next()
})

//routes
app.use('/api', authRoutes)
app.use('/', userRoutes)

const port= process.env.PORT || 8000

app.listen(port, (req, res) => {
    console.log("Server is up and running")
})