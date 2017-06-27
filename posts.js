var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;
var PostModel = require('../models/posts');
var CommentModel = require('../models/comment');
// var UserModel = require('../models/users');

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function(req, res, next) {
    // res.send(req.flash());
    // res.render('posts');

    // console.log('post get the data:');
    // // console.log(req.url);
    // var tempArr = req.url.split('&');
    // var fpid = tempArr[0].substr(2);
    // var len = fpid.length + 2;
    // var shortParams = req.url.substr(len);
    // console.log('fpid=' + fpid);
    // console.log('shortParams=' + shortParams);
    // res.write('the code is heioray');
    // res.send('hello="express"');

    var author = req.query.author;

    PostModel.getPosts(author)
        .then(function(result) {
            res.render('posts', {
                posts: result
            });
        })
        .catch(next);
});

// POST /posts 文章列表
router.post('/', checkLogin, function(req, res, next) {
    console.log('create +1');
    // res.send(req.flash());
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    try {
        if (!title.length) {
            throw new Error('标题不可为空');
        }

        if (!content.length) {
            throw new Error('内容不可为空');
        }
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('back');
    }

    var post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    PostModel.create(post).then(function(result) {
        post = result.ops[0];
        req.flash('success', '发表成功');
        res.redirect('/posts/${post._id}');
    }).catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
    res.render('create');
});

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function(req, res, next) {
    var postId = req.params.postId;
    // CommentModel.getCommentCountsByPostId(postId).then(function(result) {
    //     console.log(postId,result);
    // });
    console.log('load one blog with postId:' + postId);
    Promise.all([
        PostModel.getPostById(postId),// 获取文章信息
        CommentModel.getCommentByPostId(postId), // 获取评论内容
        PostModel.incPv(postId) // pv 加 1
    ])
    .then(function (result) {
        // console.log(result)?
        var post = result[0];
        var comments = [];
        if (result[1]) {
            comments = result[1];
        }

        if (!post) {
          throw new Error('该文章不存在');
        }

        res.render('post', {
          post: post,
          comments: comments
        });
    })
    .catch(next);
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;

    PostModel.getOriContentById(postId).then(function(result) {
        var post = result;

        res.render('edit', {
            post: post
        });
    }).catch(next);
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    console.log('update +1');
    var postId = req.params.postId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    PostModel.updatePostById(postId, author, {
        title: title,
        content: content
    }).then(function(result) {
        // console.log('postId:' + postId);
        req.flash('success', '更新成功');
        res.redirect('/posts/' + postId);
    }).catch(next);
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    PostModel.removePostById(author, postId).then(function(result) {
        console.log('remove post, id=' + postId + 'author='+ author);
        res.redirect('/posts');
    });
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
    // res.send(req.flash());
    
    var comment = {
        author: req.session.user._id,
        postId: req.params.postId,
        content: req.fields.content
    };

    CommentModel.create(comment).then(function(result) {
        req.flash('success', '评论成功');
        res.redirect('back');
    });
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    // res.send(req.flash());
    var commentId = req.params.commentId;
    var postId = req.params.postId;

    CommentModel.remove(commentId, postId)
    .then(function (result) {
        req.flash('success', '评论删除成功');
        res.redirect('back');
    }).catch(next);
});

module.exports = router;
