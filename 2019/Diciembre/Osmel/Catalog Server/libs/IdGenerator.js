'use strict';

exports.getNextId = (url, params) => {
    var randomNumber = (Math.floor(Math.random() * 99999999)).toString();
    return randomNumber;
}