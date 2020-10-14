"use strict";

const Post = require("../../models/posts.model");
const { User } = require("../../models/users.model");

module.exports = {
  //Create a post
  createPost: async (req, res) => {
    const { title, post } = req.body;
    const userId = req.session.user.id;

    const update = new Post({
      title: title,
      author: userId,
      post: post,
    });
    await update.save();
    console.log("saved");
    res.redirect("/api/posts");
  },

  //View all posts
  viewPosts: async (req, res) => {
    const currentUser = req.session.user.username;
    const isAuthor = "";
    const result = await Post.find({}).lean();
    if (!result) return res.send("No Post Found");

    res.render("view-posts", { result, isAuthor });
  },

  //view a single post
  viewPost: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById({ _id: postId });
      if (!post) return res.status(404).send("sorry, post not found");
      const currentUser = req.session.user.id;
      const author = await User.findById({ _id: post.author });
      const authorId = author._id;
      const authorName = author.username;
      let isOwner = false;
      if (currentUser == authorId || author.isAdmin == true) isOwner = true;
      res.render("view-post", {
        id: post._id,
        title: post.title,
        author: authorName,
        post: post.post,
        isOwner: isOwner,
      });
    } catch (err) {
      res.status(500).send("error occured");
    }
  },

  //view the post to be edited
  viewEdit: async (req, res) => {
    const currentUser = req.session.user;
    const postId = req.params.id;
    const post = await Post.findById({ _id: postId }).lean();
    const authorId = post.author;
    const author = await User.findById({ _id: authorId });
    res.render("edit-post", {
      title: post.title,
      post: post.post,
      id: post._id,
      currentUser: currentUser,
      author: author.username,
    });
  },

  //edit and save post
  editPost: async (req, res) => {
    const { title, post } = req.body;
    const postId = req.params.id;
    const edited = await Post.findOneAndUpdate(
      { _id: postId },
      { $set: { title: title, post: post } },
      { new: true, runValidators: true }
    );
    if (!edited) return res.send("error occured!");
    await edited.save();
    res.redirect("/api/posts");
  },
  //delete a particular post
  deletePost: async (req, res) => {
    const postId = req.params.id;
    try {
      const post = await Post.findById({ _id: postId }).lean();
      await Post.deleteOne({ _id: postId });
      res.redirect("/api/posts");
    } catch (err) {
      res.render("errors", { status: err.status, message: err.message });
    }
  },
};

//
