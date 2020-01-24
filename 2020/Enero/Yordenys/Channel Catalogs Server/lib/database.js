// API  database mysql
const config = require('../config');
const mysql = require('mysql');


//the object connection
var con = mysql.createConnection(config);

//go to the connection
con.connect(function(err) {
    if (err) throw err;
    // if connection is successful
});


//run  database query : insert , update, delete
exports.query = (query) => {
    con.query(query, function(err, result, fields) {
        if (err) throw err;
    })
}

//run  database query : select one element
exports.get = (query, res) => {
    con.query(query, function(err, result, fields) {
        if (err) throw err;
        res.status(200).json(result[0]);
    })
}

//run  database query : select many element
exports.list = (query, res) => {
    con.query(query, function(err, result, fields) {
        if (err) throw err;
        res.status(200).json(result);
    })
}