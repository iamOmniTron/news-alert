'use strict'
const express = require('express');
const mongoose = require('mongoose');
const {User}= require('../models/users.model')
const {login,signup,profile,logout} = require('../controllers/auth-controller');
const {ensureAuth,ensureSession} = require('../middlewares/ensureAuth');
const router = express.Router();

  router.get('/login',ensureAuth,(req,res)=>{
    res.render('login');
  });

  router.post('/login',login);

  router.get('/signup',ensureAuth,(req,res)=>{
    res.render('signup')
  });

  router.post('/signup',signup);

  router.get('/',async(req,res)=>{
   const apiKey = process.env.API_KEY;
   const axios = require('axios');
   const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
   try {
    const results = await axios.get(url);
    const news = results.data.articles;
    res.render('home',{news})
   } catch (err) {
     res.json(err.message)
   }
  });
  router.get('/profile',profile);
  router.get('/logout',logout)

module.exports = router;



























//
