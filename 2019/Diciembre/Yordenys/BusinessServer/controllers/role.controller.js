const business = require('../models/business.model');
const Authorization = require('../Authorization/Authorization');
const generateCode = require('../generateCode/generateCode');
const role = require('../models/role.model');

exports.create = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.body.user_id, bid: req.body.bid });
    if (authorization) {
        if (req.body.role_name.length < 4) {
            res.status(201).json({
                status: "Fail",
                message: "Error: Unique name should be at least 4 characters length"
            });
            throw "Error: Unique name should be at least 4 characters length";
        }

        var businessTemp = await business.find({ created_by: req.body.user_id, bid: req.body.bid })[0];
        var exists_rol_name = businessTemp.roles.
        find((rol) => {
            return rol.name == req.body.role_name;
        });

        if (exists_rol_name) {
            res.status(201).json({
                status: "Failed",
                message: "rol with same unique name already exists"
            });
            throw "rol with same unique name already exists";
        }

        businessTemp.roles.push(new role({
            role_id: generateCode.getNextId(),
            name: req.body.role_name,
            title: req.body.role_title,
            desc: req.body.role_desc,
            created_at: new Date(),
            created_by: req.body.user_id,
            permissions: req.body.permissions
        }));

        var query = { created_by: req.body.user_id, bid: req.body.bid };

        var valueUpdate = { $set: { roles: businessTemp.roles } };

        await business.updateMany(query, valueUpdate, function(err, result) {
            if (err) {
                res.status(201).json({
                    status: "faild",
                    message: "Is update rol faild"
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Is update rol successfull"
                });
            }
        });
        // event kafka
    }
}

exports.edit = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.body.user_id, bid: req.body.bid });
    if (authorization) {
        var businessTemp = await business.find({ created_by: req.body.user_id, bid: req.body.bid })[0].
        relos.
        find((rol) => {
            if (rol.role_id == req.body.dep_id) {
                rol.name = req.body.name;
                rol.desc = req.body.decription;
                rol.permissions = req.body.permissions;
            }
            return rol.role_id == req.body.role_id;
        });
        var query = { created_by: req.body.user_id, bid: req.body.bid };
        var valueUpdate = { $set: { relos: businessTemp.relos } };
        await business.updateMany(query, valueUpdate, function(err, result) {
            if (err) {
                res.status(201).json({
                    status: "faild",
                    message: "Is update business faild"
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Is update business successfull"
                });
            }
        });
    }
}

exports.delete = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.body.user_id, bid: req.body.bid });
    if (authorization) {
        var businessTemp = await business.find({ created_by: req.body.user_id, bid: req.body.bid })[0].
        roles.
        filter((rol) => {
            return rol.role_id != req.body.role_id;
        });
        var query = { created_by: req.body.user_id, bid: req.body.bid };
        var valueUpdate = { $set: { roles: businessTemp.roles } };
        business.updateMany(query, valueUpdate, function(err, result) {
            if (err) {
                res.status(201).json({
                    status: "faild",
                    message: "Is update business faild"
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Is update business successfull"
                });
            }
        });
    }
}

exports.list = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.body.user_id, bid: req.body.bid });
    if (authorization) {
        listRoles = business.find({ created_by: req.body.user_id, bid: req.body.bid })[0].roles;
        if (listRoles) {
            res.status(200).json({
                status: "success",
                message: "Is delete role successfull"
            });
        } else {
            res.status(201).json({
                status: "faild",
                message: "Is delete role faild"
            });
        }
        return listRoles
    }
}