var Post = require('../lib/mongo').Post;

module.exports = {
    // 添加一篇文章
    create: function create(user) {
        return Post.create(user).exec();
    },
    getPostByName: function getPostByName(name) {
        return Post.findOne({ name: name }).exec();
    }
};
