var User = require('../lib/mongo').User;

module.exports = {
    // 注册一个用户
    create: function create(user) {
            return User.create(user).exec();
        }
        /*,
        // 注销一个用户
        delete: function delete(user) {
            User.delete(user).exec();
        }*/
};
