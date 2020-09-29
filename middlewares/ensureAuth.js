'use strict'
const jwt = require('jsonwebtoken');
const {User} = require('../models/users.model')
const options = {algorithm :"HS256",expiresIn:648000}

module.exports = {
  // TODO: allow ensure current user is the owner of the session
  auth : async(req,res,next)=>{
    const token = req.cookies.token;
    await jwt.verify(token,secret,(err,user)=>{
      if (err) return res.status(400).send(err.message)
        res.send(user);
    });
    res.send(secret)
  },
//ensures user cant access login page unless loggedOut, mount at home
  ensureSession: async(req,res,next)=>{
    if (req.session) {
      return res.redirect('/');
    }else {
       res.redirect('/login')
    }
    next();
  },
  //mount at login/signup
  ensureAuth: async (req,res,next)=>{
    if(!req.session) return res.redirect('/login');
    next();
  }
}
// TODO: solve this

















//
