var configDB = require('../../config/database.config');
var Knex = require('knex')(configDB);
var Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;