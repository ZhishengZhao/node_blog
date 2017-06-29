module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('/posts');
    });
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/posts', require('./posts'));
    app.use('/httpdemo', require('./httpdemo'));
    //添加404页面
    app.use(function(req, res) {
        if (!res.headersSent) {
            res.status(404).render('404');
        }
    });

};
