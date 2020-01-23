var Bookshelf = require('../commons/bookshelf');
Bookshelf.plugin('registry');

var Members = Bookshelf.Model.extend({
    tableName: 'members',
    roles: function () {
        return this.hasOne('Roles');
    }
});
module.exports = Bookshelf.model('Members', Members);