var Post = require('../lib/mongo').Post;
var CommentModel = require('./comment');
var marked = require('marked');

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentCountsByPostId(post._id).then(function (commentsCount) {
        console.log('-----count------', post._id, commentsCount);
        post.commentsCount = commentsCount;
        return post;
      });
    }));
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentCountsByPostId(post._id).then(function (count) {
        console.log('findone-----count------', post._id, count);
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  }
});

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
});

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
            .addCommentsCount()
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
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },
    incPv: function incPv(postId) {
        return Post.update({ _id: postId }, { $inc: { pv: 1 } })
            .exec();
    },
    removePostById: function removePostById(author, postId) {
        return Post.remove({author: author, _id: postId}).exec();
    },
    updatePostById: function updatePostById(postId, author, data) {
        return Post.update({_id: postId, author: author}, {$set: data}).exec();
    },
    getOriContentById: function getOriContentById(postId) {
        return Post.findOne({_id: postId}).exec();
    }
};
