"use strict";

const { User, validateUser } = require("../models/users.model");
const config = require("config");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joi = require("joi");

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        req.flash("error", "incorrect password/usermail");
        res.redirect("/login");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await bcrypt.compare(hashedPassword, user.password);
      req.session.user = {
        id: user.id,
        username: user.username,
      };
      req.flash("success", `welcome ${req.session.user.username}`);
      res.redirect("/");
    } catch (err) {
      req.flash("error", "error occured");
      res.redirect("back");
    }
  },
  signup: async (req, res) => {
    const { error } = validateUser(req.body);
    if (error)
      return res.render("errors", {
        status: error.status,
        message: error.message,
      });

    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        req.flash("error", "username already exists");
        res.redirect("/signup");
      }
      user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      user.username === "abdulmumeen"
        ? (user.isAdmin = true)
        : (user.isAdmin = false);
      user.password = await bcrypt.hash(user.password, 10);
      const token = await jwt.sign(
        { username: user.username },
        config.get("secret"),
        { algorithm: "HS256", expiresIn: 43200 }
      );
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 43200000,
        secure: false,
      });
      await user.save();
      req.session.user = {
        id: user.id,
        username: user.username,
      };
      req.flash("success", "user registration successful");
      res.redirect("/");
    } catch (err) {
      req.flash("error", "an error occured");
      res.redirect("/signup");
    }
  },
  profile: async (req, res) => {
    const userId = req.session.user.id;
    try {
      const user = await User.findOne({ _id: userId });
      res.render("profile", {
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      res.render("errors", { status: err.status, message: err.message });
    }
  },
  logout: async (req, res) => {
    req.flash("success", "logout successful");
    req.session.destroy((err) => {
      if (err) return console.log(err);
      req.session = null;
      res.clearCookie("token");
      res.redirect("/login");
    });
  },
};
