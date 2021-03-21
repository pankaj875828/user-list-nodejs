const express = require('express');
const router= express.Router();
const mongoose = require('mongoose');
const User = require('../Model/user');
const Auth = require('../Model/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.get('/',(req,res,next)=>{
    User.find({},(err,user)=>{
        if(err){
            res.status(400).json({errmsg:err})
        }else{
            res.status(200).json({msg:user})
        }
    })
})

router.post('/create',(req,res,next)=>{
    console.log(req.body);
    const user = new User(req.body)
    user.save()
    .then((createUser)=>{
        res.status(200).json({msg:createUser})
    }).catch((err)=>{
        res.status(400).json({errmsg:err})
    })
})

router.put('/update',(req,res,next)=>{
    User.findById(req.body._id,(err,user)=>{
        if(err)
            res.status(400).json({errmsg:err})
        user.name = req.body.name
        user.email = req.body.email
        user.phone = req.body.phone
        user.work = req.body.work
        user.exp = req.body.exp
        user.save((err,user)=>{
            if (err)
                res.status(500).json({ errmsg: err })
            res.status(200).json({ UpdateUser: user })
        })
    })
})

router.delete('/delete/:id',(req,res,next)=>{
    User.findByIdAndRemove({_id:req.params.id},(err,user)=>{
        if (err)
            res.status(500).json({ errmsg: err })
        res.status(200).json({ DeleteUser: user })
    }) 
})

router.post('/register',async(req,res,next)=>{
    try{

    const hashedPassword = await bcrypt.hash(req.body.password,10)
    let auth = new Auth({
        email:req.body.email,
        password:hashedPassword
    })
    auth.save((err,registeredAuth)=>{
        if(err){
            console.log(err)
        }else{
            let payload = {subject:registeredAuth._id}
            let token = jwt.sign(payload,'secretKey')
            res.status(200).send({token})
        }
    })
    }catch{
        res.redirect('/register')
    }
})

router.post('/login',(req,res,next)=>{
    Auth.find({email:req.body.email}).exec()
    .then(auth=>{
        if(auth.length<1){
            return res.status(401).json({message:"Auth Fail"})
        }
        bcrypt.compare(req.body.password,auth[0].password,(err,result)=>{
            if(err){
                return res.status(400).json({message:"Auth Fail"})
            }
            if(result){
                const token=jwt.sign({
                    email:auth[0].email,
                    id:auth[0]._id
                },
                'vgkgkgkghkhkhkhkhkhkhkhkhk',
                {
                    expiresIn:'1h'
                }
                )
                return res.status(200).json({
                    message:"Auth Successfull",
                    token:token
                })
            }
            return res.status(401).json({message:"Auth Fail"})
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(401).json({errror:err})
    })
})
module.exports=router