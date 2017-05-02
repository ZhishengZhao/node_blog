var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', {
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enum: ['m', 'f', 'x'] },
    bio: { type: 'string' }
});

exports.Record = mongolass.model('Record', {
    fpId: { type: 'string' },
    shortId: { type: 'string' },
    params: { type: 'string' }
});

exports.User.index({ name: 1 }, { unique: true }).exec(); // 根据name辨识唯一的用户，用户名全局唯一
