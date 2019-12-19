const business = require('../models/business.model');
const Authorization = require('../lib/Authorization');
const generateCode = require('../generateCode/generateCode');
const role = require('../models/role.model');

exports.list = async({ role_id, bid }) => {
    try {
        businessTemp = await business.find({ bid: bid });
        if (businessTemp) {
            resul = []
            await businessTemp.roles.find(rol => {
                if (rol.role_id == role_id)
                    rol.permissions.forEach(perm => {
                        resul.push(perm.perm_id)
                    })
                return rol.role_id == role_id
            });
            return resul
        } else {
            return Array()
        }
    } catch (error) {
        return Array()
    }
}