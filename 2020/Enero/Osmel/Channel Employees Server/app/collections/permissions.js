var Bookshelf = require('../commons/bookshelf');

var Permission = require('../models/permissions');

var Permissions = Bookshelf.Collection.extend({
	model : Permission
});
module.exports = Permissions;