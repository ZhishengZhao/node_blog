var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;
var PostModel = require('../models/posts');
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

// POST /posts 发表一篇文章
router.post('/', checkLogin, function(req, res, next) {
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
        console.log(post);
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
    // res.render('')
    res.send(req.flash());
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;
