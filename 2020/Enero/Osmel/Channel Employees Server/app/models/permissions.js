var Bookshelf = require('../commons/bookshelf');
Bookshelf.plugin('registry');

var Roles = require('./roles');

var Permissions = Bookshelf.Model.extend({
    tableName: 'permissions',
    hasTimestamps: true,
    roles: function () {
        return this.belongsTo('Roles', 'role_id');
    }
});
module.exports = Bookshelf.model('Permissions', Permissions);