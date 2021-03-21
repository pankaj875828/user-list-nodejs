require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserRoutes = require('./Routes/user')
const cors = require('cors')
const mongo_db = process.env.MONGO_DB

mongoose.connect(mongo_db,{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>{
    console.log("success")
}).catch((e)=>{
    console.log(e)
})
app.use(cors())
app.use(express.json());
app.use('/user',UserRoutes)

module.exports=app;