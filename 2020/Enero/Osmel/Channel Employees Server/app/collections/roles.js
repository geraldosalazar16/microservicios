var Bookshelf = require('../commons/bookshelf');

var Role = require('../models/roles');

var Roles = Bookshelf.Collection.extend({
	model : Role
});
module.exports = Roles;