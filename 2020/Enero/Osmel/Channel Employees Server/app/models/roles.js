var Bookshelf = require('../commons/bookshelf');
Bookshelf.plugin('registry');

var Permissions = require('./permissions');
var Members = require('./members');

var Roles = Bookshelf.Model.extend({
    tableName: 'roles',
    hasTimestamps: true,
    permissions: function () {
        return this.hasMany('Permissions');
    },
    members: function () {
        return this.hasOne('Members');
    }
});
module.exports = Bookshelf.model('Roles', Roles);