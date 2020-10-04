"use strict";
const jwt = require("jsonwebtoken");
const { User } = require("../models/users.model");
const options = { algorithm: "HS256", expiresIn: 648000 };

module.exports = {
  //ensures user cant access login page unless loggedOut, mount at login/signup
  ensureSession: async (req, res, next) => {
    const user = req.session.user;
    if (user) return res.redirect("back");
    next();
  },
  //mount at all other protected routes
  ensureAuth: async (req, res, next) => {
    const { user } = req.session;
    if (!user) return res.redirect("/login");
    next();
  },
};
