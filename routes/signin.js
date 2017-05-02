var express = require('express');
var router = express.Router();

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
