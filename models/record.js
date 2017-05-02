var Record = require('../lib/mongo').Record;

module.exports = {
    create: function create(record) {
        return Record.create(record).exec();
    }
};
