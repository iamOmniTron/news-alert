'use strict'
const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,`username is required`],
    minlength:[4,`username must be atlest 4 letters long`],
    maxlength:[20,`username too long`],
  },
  email:{
    type:String,
    required:[true,`email is required`],
    minlength:[11,`email too short`],
    maxlength:[45,`email too long`],
    unique:true,
  },
  password:{
    type:String,
    required:[true,`password is required`],
    minlength: [5,`password too short`],
  },
  isAdmin:Boolean
});



const User = mongoose.model('User',UserSchema);


function validateUser(user){
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().min(10).max(255).required().email(),
    password: joi.string().min(5).max(255).required().strict(),
    password2: joi.string().valid(joi.ref('password')).required().strict(),
  });
  return schema.validate(user);
 }



module.exports= {User,validateUser};
























//
