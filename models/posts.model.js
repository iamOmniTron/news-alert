"use strict";

const mongoose = require("mongoose");
const User = require("./users.model");
const Schema = mongoose.Schema;

//the Author references the User Model
const PostSchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 25,
  },
  post: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
