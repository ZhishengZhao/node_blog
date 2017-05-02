var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    // res.send(req.flash());
    res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
    // res.send(req.flash());
    // res.render('signup', {
    //     name: 'req.params.name'
    // });
    var name = req.fields.name;
    var gender = req.fields.gender;
    var bio = req.fields.bio;
    // var avatar = req.fields.avatar;
    var password = req.fields.password;
    var repassword = req.fields.repassword;

    try {
        if (name.length > 10 || name.length < 1) {
            throw new Error('name\'s length should be between 1 and 10');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error('hey man, your gender is really wird');
        }
        if (password.length < 6 || password.length > 10) {
            throw new Error('password\'s length should be between 6 and 10');
        }
        if (repassword !== password) {
            throw new Error('two password are not the same')
        }
        if (bio.length > 30 || bio.length < 1) {
            throw new Error('bio\'s length should be between 1 and 30');
        }
    } catch (e) {
        console.log(e);
        // fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    // encode the password
    password = sha1(password);

    var user = {
        name: name,
        password: password,
        gender: gender,
        // avatar: avatar,
        bio: bio
    };

    UserModel.create(user).then(function(result) {
        // the result contains the userinfo
        user = result.ops[0];
        // save userinfo in session
        delete user.password;
        req.session.user = user;
        // show a tip of success
        req.flash('success', 'congradulations! signup success');
        // redirect to index.html
        res.redirect('/posts');
    }).catch(function(e) {
        // signup failed, then delete the avatar pic asnyc
        // fs.unlink(req.files.avatar.path);
        // if user has existed, redirect to signup page and show tip
        if (e.message.match('E11000 dubplicate key')) {
            req.flash('error', 'sorry, the user has existed');

        }
        next(e);
    });
});

// router.get('/:name', function(req, res) {
//   res.render('users', {
//     name: req.params.name
//   });
// });

module.exports = router;
