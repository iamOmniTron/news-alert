"use strict";

const {
  createPost,
  viewPost,
  viewEdit,
  viewPosts,
  editPost,
  deletePost,
} = require("./post-controller");
const { ensureAuth } = require("../../middlewares/auth");
const apiRouter = require("express").Router();

apiRouter.get("/posts", ensureAuth, viewPosts);
apiRouter.get("/posts/create", ensureAuth, (req, res) => {
  res.render("create-post");
});
apiRouter.post("/posts/create", createPost);
apiRouter.get("/posts/:id", ensureAuth, viewPost);
apiRouter.get("/posts/edit/:id", ensureAuth, viewEdit);
apiRouter.post("/posts/edit/:id", editPost);
apiRouter.delete("/posts/delete/:id", deletePost);

module.exports = apiRouter;
