'use strict'

const {User,validateUser}= require('../models/users.model');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const joi = require('joi');



module.exports ={

  login: async(req,res)=>{
    const {username,password} = req.body;

    try {
      const user = await User.findOne({username:req.body.username});
      if(!user) return res.send("user don't exist");
      const hashedPassword = await bcrypt.hash(password,10);
      await bcrypt.compare(hashedPassword,user.password);
      req.session.user = {
        id: user.id,
        username: user.username
      }
      res.redirect('/');
    } catch (err) {
      throw new Error(err.message)
    }
  },
  signup: async (req,res)=>{

    const {error} = validateUser(req.body);
    if (error) return res.status(400).json({ error:error.details[0].message});


    try {

      let user = await User.findOne({username:req.body.username});
      if(user) return res.send('user already exist!');
      user = new User({
        username: req.body.username,
        email:req.body.email,
        password:req.body.password
      });

      user.username === 'abdulmumeen'? user.isAdmin = true: user.isAdmin= false;
      user.password = await bcrypt.hash(user.password,10);
      const token = await jwt.sign({username:user.username}, process.env.SECRET,{algorithm :"HS256",expiresIn:360000});
      res.cookie('token',token,{httpOnly:true,maxAge:360000,secure:false})
      await user.save();
      req.session.user = {
        id: user.id,
        username: user.username
      };
      res.redirect('/');
    } catch (err) {
        res.status(500).send('error occured')
      }
  },
  profile:async (req,res)=>{
    const userId = req.session.user.id;
    try {

      const user = await User.findOne({_id:userId});
      res.render('profile',{username:user.username,email:user.email});
    } catch (err) {
      res.status(400).send('error');
    }
  },
  logout: async(req,res)=>{

    req.session.destroy((err)=>{
      if(err) return console.log(err);
      req.session = null;
      res.clearCookie('token');
      res.redirect('/login');
    })
  }
}


























//
