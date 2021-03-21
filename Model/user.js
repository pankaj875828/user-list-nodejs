const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    work:String,
    exp:String
})

module.exports=mongoose.model('Lists',UserSchema)