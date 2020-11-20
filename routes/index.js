"use strict";
const express = require("express");
const { User } = require("../models/users.model");
const { search } = require("./api/post-controller");
const { ensureSession, ensureAuth } = require("../middlewares/auth");
const {
  login,
  signup,
  profile,
  logout,
} = require("../controllers/auth-controller");
const router = express.Router();

router.get("/login", ensureSession, (req, res) => {
  res.render("login", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

router.post("/login", login);

router.get("/signup", ensureSession, (req, res) => {
  res.render("signup", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

router.post("/signup", signup);

router.get("/", ensureAuth, async (req, res) => {
  const apiKey = process.env.API_KEY;
  const axios = require("axios");
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  try {
    const results = await axios.get(url);
    const news = results.data.articles;
    res.render("home", {
      news: news,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (err) {
    res.render("errors", {
      status: err.status,
      message: "cannot get news at the moment...",
    });
  }
});
router.get("/profile", ensureAuth, profile);
router.get("/logout", ensureAuth, logout);
module.exports = router;
