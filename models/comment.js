var Comment = require('../lib/mongo').Comment;
var marked = require('marked');

// 将 comment 的 content 从 markdown 转换成 html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content);
      return comment;
    });
  }
});

module.exports = {
    create: function create(comment) {
        return Comment.create(comment).exec();
    },
    getCommentByPostId: function getCommentByPostId(postId) {
        return Comment.find({
            postId: postId
        }).populate({ path: 'author', model: 'User' })
        .sort({ _id: 1 })
        .addCreatedAt()
        .contentToHtml()
        .exec();
    },
    getCommentCountsByPostId: function getCommentCountsByPostId(postId) {
        var num = Comment.count({postId: postId}).exec();
        // console.log(postId, num);
        return num;
    },
    remove: function remove(commentId, postId) {
        return Comment.remove({
            _id: commentId,
            postId: postId
        }).exec();
    }
};