var Bookshelf = require('../commons/bookshelf');

var Member = require('../models/members');

var Members = Bookshelf.Collection.extend({
	model : Member
});
module.exports = Members;