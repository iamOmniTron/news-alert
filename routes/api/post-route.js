'use strict'

const {createPost,viewPost,viewEdit,viewPosts,editPost,deletePost} = require('./post-controller');


const apiRouter = require('express').Router();

apiRouter.get('/posts',viewPosts);
apiRouter.get('/posts/create',(req,res)=>{
  res.render('create-post');
});
apiRouter.post('/posts/create',createPost);
apiRouter.get('/posts/:id',viewPost);
apiRouter.get('/posts/edit/:id',viewEdit);
apiRouter.post('/posts/edit/:id',editPost);
apiRouter.delete('/posts/delete/:id',deletePost);

module.exports = apiRouter;
