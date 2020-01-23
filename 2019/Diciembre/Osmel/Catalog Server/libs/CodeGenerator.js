'use strict';

exports.getNextCode = (unique_name) => {
    var randomNumber = (Math.floor(Math.random() * 999)).toString();
    return unique_name+randomNumber;
}