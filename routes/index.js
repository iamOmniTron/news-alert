"use strict";
const express = require("express");
const { User } = require("../models/users.model");
const { ensureSession, ensureAuth } = require("../middlewares/auth");
const {
  login,
  signup,
  profile,
  logout,
} = require("../controllers/auth-controller");
const router = express.Router();

router.get("/login", ensureSession, (req, res) => {
  res.render("login");
});

router.post("/login", login);

router.get("/signup", ensureSession, (req, res) => {
  res.render("signup");
});

router.post("/signup", signup);

router.get("/", ensureAuth, async (req, res) => {
  const apiKey = process.env.API_KEY;
  const axios = require("axios");
  try {
    const results = await axios.get(url);
    const news = results.data.articles;
    res.render("home", { news: news });
  } catch (err) {
    res.render("errors", { status: err.status, message: err.message });
  }
});
router.get("/profile", ensureAuth, profile);
router.get("/logout", ensureAuth, logout);
module.exports = router;
