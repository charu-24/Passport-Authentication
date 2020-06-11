const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const flash = require('connect-flash')
const passport = require('passport')

// router.get('/', (req, res) => 
//     res.render('welcome')
// )

// router.get('/dashboard', (req, res) => res.render('dashboard'))

router.get('/login',(req,res) => {
    res.render('login')
})

router.get('/register',  (req,res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    var errors = []
    if( !name || !email || !password || !password2){
        errors.push({ msg: "Hey all feilds are required.."})
    }

    if(password !== password2){
        errors.push({ msg: "Hey confirm ur password match.."})
    }

    if(password.length < 6){
        errors.push({ msg:"Hey password length must be atleast 6"})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        User.findOne({ email:email})
        .then(user => {
            if(user) {
                //User exists
                errors.push({ msg :'Email already exists'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser = new User({
                    name,email,password
                });
                // hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;

                    //save user
                    newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are successfully registered and can login')
                        res.redirect('/api/login')
                    })
                    .catch((err) => console.log(err))
                }))
            }
        })
    }

})

//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate("local",{
        successRedirect: '/dashboard',
        failureRedirect: './login',
        failureFlash: true
    })(req, res, next);
})

//logout handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', "You are logged out")
    res.redirect('/api/login')
})



module.exports = router