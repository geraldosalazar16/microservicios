'use strict';

exports.UUID = () => {
    var FlakeIdGen = require('flake-idgen'),
            intformat = require('biguint-format'),
            generator = new FlakeIdGen();
        var idGenerator = generator.next();
        return intformat(idGenerator, 'dec');
}