// const ownership = require('../schema/schema');
var Member = require('../models/members');
var Members = require('../collections/members');
var Authorization = require('../../libs/Authorization');
const { sendMessages } = require('../../kafka');

// Bind a user to a channel.
exports.bind = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var member_id = req.body.member_id;
    var role_id = '_employee';

    // Authorization
    var authorized = Authorization.authorize("channel_employees/members/bind", { user_id, bid, chid, member_id });
    if (authorized.status === 'success') {

        Member.forge({
            role_id: role_id,
            bid: bid,
            chid: chid,
            member_id: member_id

        })
            .save()
            .then(function (member) {
                memberMessage = {
                    user_id: user_id,
                    bid: bid,
                    chid: chid,
                    member_id: member_id,
                    role_id: role_id,
                    created_at: new Date()
                }
                const kafkaMessage = JSON.stringify(Object.assign(memberMessage));
                sendMessages('channel_employees_employee_bound', kafkaMessage);
                res.status(200).json({
                    status: 'Success',
                    message: 'Member has ben created'
                })
            })
            .catch(function (err) {
                res.status(500)
                    .json({
                        status: 'Failed',
                        message: err.message
                    });
            });
    } else {
        res.status(403).send('Not authorized');
    }
};

// Bind a list of users to a channel.
exports.bindAll = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var member_ids = req.body.member_ids;
    var role_id = '_employee';
    var cont = 0;

    // Authorization
    var authorized = Authorization.authorize("channel_employees/members/bind", { user_id, bid, chid, member_ids });
    if (authorized.status === 'success') {
        for (var i = 0; i < member_ids.length; i++) {

            Member.forge({
                role_id: role_id,
                bid: bid,
                chid: chid,
                member_id: member_ids[i]

            })
                .save()
                .then(function (member) {

                })
                .catch(function (err) {
                    res.status(500)
                        .json({
                            status: 'Failed',
                            message: err.message
                        });
                });
            cont = i + 1;
        }
        if (cont == member_ids.length) {
            memberMessage = {
                user_id: user_id,
                bid: bid,
                chid: chid,
                member_ids: member_ids,
                role_id: role_id,
                created_at: new Date()
            }
            const kafkaMessage = JSON.stringify(Object.assign(memberMessage));
            sendMessages('channel_employees_employee_bound', kafkaMessage);
            res.status(200).json({
                status: 'Success',
                message: 'Members has ben created'
            })
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// Update role of employee.
exports.updateRole = (req, res, next) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var member_id = req.body.member_id;
    var role = req.body.role;

    var authorized = Authorization.authorize("channel_employees/members/role:update", { user_id, member_id, role });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid || !member_id) {
            return res.status(400).send({
                status: 'Failed',
                message: "Update role channel content bid, chid or member_id can not be empty"
            });
        } else {
            Member.forge({ bid: bid, chid: chid, member_id: member_id })
                .fetch({ require: true })
                .then(function (user) {
                    user.save({
                        role_id: role
                    }).then(function () {
                        memberMessage = {
                            by: user_id,
                            bid: bid,
                            chid: chid,
                            member_id: member_id,
                            role: role,
                            created_at: new Date(),
                        }
                        const kafkaMessage = JSON.stringify(Object.assign(memberMessage));
                        sendMessages('channel_employees_employee_role_updated', kafkaMessage);
                        res.status(200).json({
                            status: 'Success',
                            message: 'Member role updated'
                        })
                    })
                        .catch(function (err) {
                            res.status(500).json({
                                status: 'Failed',
                                message: err.message
                            })
                        })
                })
                .catch(function (err) {
                    res.status(500).json({
                        status: 'Failed',
                        message: err.message
                    })
                })
        }

    } else {
        res.status(403).send('Not authorized');
    }

}


// Unbind a user from a channel.
exports.unbind = (req, res, next) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var member_id = req.body.member_id;

    // Authorization
    var authorized = Authorization.authorize("channel_employees/members/unbind", { user_id, bid, chid, member_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid || !member_id) {
            return res.status(400).send({
                status: 'Failed',
                message: "User from a channel content bid, chid or member_id can not be empty"
            });
        } else {
            Member.forge({ bid: bid, chid: chid, member_id: member_id })
                .fetch({ require: true })
                .then(function (user) {
                    user.destroy()
                        .then(function () {
                            memberMessage = {
                                user_id: user_id,
                                bid: bid,
                                chid: chid,
                                member_id: member_id,
                                created_at: new Date(),
                            }
                            const kafkaMessage = JSON.stringify(Object.assign(memberMessage));
                            sendMessages('channel_employees_employee_unbound', kafkaMessage);
                            res.status(200).json({
                                status: 'Success',
                                message: 'Member successfully deleted'
                            })
                        })
                        .catch(function (err) {
                            res.status(500).json({
                                status: 'Failed',
                                message: err.message
                            })
                        })
                })
                .catch(function (err) {
                    res.status(500).json({
                        status: 'Failed',
                        message: err.message
                    })
                })
        }
    } else {
        res.status(403).send('Not authorized');
    }
}

// Unbind a list of users from a channel.
exports.unbindAll = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var member_ids = req.body.member_ids;

    // Authorization
    var authorized = Authorization.authorize('channel_employees/members/unbind', { user_id, bid, chid, member_ids });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid || member_ids.length < 1) {
            return res.status(400).send({
                status: 'Failed',
                message: "List of users from a channel content bid, chid or member_ids can not be empty"
            });
        } else {
            for (var i = 0; i < member_ids.length; i++) {
                Member.forge({ bid: bid, chid: chid, member_id: member_ids[i] })
                    .fetch({ require: true })
                    .then(function (user) {
                        user.destroy()
                            .then(function () {
                                res.status(200).json({
                                    status: 'Success',
                                    message: 'Members successfully deleted'
                                })
                            })
                            .catch(function (err) {
                                res.status(500).json({
                                    status: 'Failed',
                                    message: err.message
                                })
                            })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            status: 'Failed',
                            message: err.message
                        })
                    })
                cont = i + 1;
            }
            if (cont == member_ids.length) {
                memberMessage = {
                    user_id: user_id,
                    bid: bid,
                    chid: chid,
                    member_ids: member_ids,
                    created_at: new Date(),
                }

                const kafkaMessage = JSON.stringify(Object.assign(memberMessage));
                sendMessages('channel_employees_employee_group_unbound', kafkaMessage);
                res.status(200).send({
                    status: 'Success',
                    message: 'Members has been deleted'
                });
            }
        }
    } else {
        res.status(403).send('Not authorized');
    }
};


