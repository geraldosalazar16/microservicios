const business = require('../models/business.model');
const Authorization = require('../Authorization/Authorization');
const generateCode = require('../generateCode/generateCode');
const role = require('../models/role.model');

exports.list = async function(req, res) {
    businessTemp = business.find({ bid: req.body.bid });
    if (businessTemp) {
        resul = []
        businessTemp.roles.find(rol => {
            if (rol.role_id == req.body.role_id)
                rol.permissions.forEach(perm => {
                    resul.push(perm.perm_id)
                })
        });
        res.status(200).json({
            status: "success",
            message: "Is operation successfull"
        });
        return resul
    } else {
        res.status(201).json({
            status: "faild",
            message: "Is operation faild"
        });
        throw "Is operation faild"
    }
}