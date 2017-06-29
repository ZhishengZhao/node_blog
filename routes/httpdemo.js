var express = require('express');
var router = express.Router();

var RecordModel = require('../models/record');

router.get('/nocros', function(req, res, next) {
    res.send('hello="express"');
});

//
router.get('/cros', function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS,DELETE,PUT");
    res.send('hello="express"');
});

router.get('/closeconnection', function(req, res, next) {
    res.setHeader("connection", "close");
    res.send('hello="express"');
});

module.exports = router;


// var express = require('express');
// var router = express.Router();

// var RecordModel = require('../models/record');

// //
// router.get('/', function(req, res, next) {
//     // res.send(req.flash());
//     // res.render('posts')
//     console.log('post get the data:');
//     // console.log(req.url);
//     var tempArr = req.url.split('&');
//     var fpid = tempArr[0].substr(2);
//     var len = fpid.length + 2;
//     var shortParams = req.url.substr(len);
//     console.log('fpid=' + fpid);
//     console.log('shortParams=' + shortParams);
//     // res.write('the code is heioray');
//     var record = {
//         fpId: name,
//         shortId: password
//     };

//     RecordModel.create(record).then(function(result) {
//         // the result contains the recordinfo
//         record = result.ops[0];
//         // save recordinfo in session
//         req.session.record = record;
//         // show a tip of success
//         req.flash('success', 'congradulations! signup success');
//         // redirect to index.html
//         res.redirect('/posts');
//     }).catch(function(e) {
//         // signup failed, then delete the avatar pic asnyc
//         // fs.unlink(req.files.avatar.path);
//         // if user has existed, redirect to signup page and show tip
//         if (e.message.match('E11000 dubplicate key')) {
//             req.flash('error', 'sorry, the user has existed');

//         }
//         next(e);
//     });

//     res.send('hello="express"');
// });

// module.exports = router;
