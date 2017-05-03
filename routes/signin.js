var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var userModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next) {
    // res.send(req.flash());
    res.render('signin');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function(req, res, next) {
    // res.send(req.flash());
    var name = req.fields.name;
    var password = req.fields.password;
    password = sha1(password);

    userModel.getUserByName(name).then(function(user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('back');
        }

        if (password !== user.password) {
            req.flash('error', '密码错误');
            return res.redirect('back');
        }

        req.flash('success', '登陆成功');

        delete user.password;
        req.session.user = user;
        return res.redirect('/posts');
    });


    try {
        if (name === '' || password === '') {
            throw new Error('username & password can not be null');
        }
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signin');
    }
});

module.exports = router;
