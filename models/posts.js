var Post = require('../lib/mongo').Post;
var marked = require('marked');

Post.plugin('contentToHtml', {
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne: function(post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
})



module.exports = {
    // 添加一篇文章
    create: function create(posts) {
        return Post.create(posts).exec();
    },
    getPostByName: function getPostByName(name) {
        return Post.findOne({ name: name }).exec();
    },
    getPostById: function getPostById(postId) {
        return Post.findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .addCreatedAt()
            .exec();
    },
    getPosts: function getPosts(author) {
        var query = {};
        if (author) {
            query.author = author;
        }

        return Post.find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },
    incPv: function incPv(postId) {
        return Post.update({ _id: postId }, { $inc: { pv: 1 } })
            .exec();
    }
};
