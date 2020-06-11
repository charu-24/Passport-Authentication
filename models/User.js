const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        maxlength:20
    },
    email:{
        type: String,
        required: true,
        trim: true,
        
    },

    password:{
        type: String,
        required: true,
        trim:true,
        maxlenght:6
    },
    date:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("User", userSchema)