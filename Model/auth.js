const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
    email:String,
    password:String
})

module.exports=mongoose.model('Auth',AuthSchema)