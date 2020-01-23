'use strict';

exports.getNextId = () => {
    var randomNumber = (Math.floor(Math.random() * 99999999)).toString();
    return randomNumber;
}