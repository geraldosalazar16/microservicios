const Authorization = require('../lib/Authorization');
const {validationResult} = require('express-validator');
const {sendMessages} = require('../kafka');
const uuidv4 = require('uuid/v4');
const group = require('../models/group.model');


exports.create = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            // parameters
            const user_id = req.body.user_id;
            const bid = req.body.bid;
            const title = req.body.title;
            const desc = req.body.desc;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/group/create', {
                user_id: user_id,
                bid: bid
            });

            // Authorized user
            if (authorized.status === 'success') {
                const newGroup = new group({
                    group_id: uuidv4(),
                    bid: bid,
                    title: title,
                    desc: desc
                });

                await newGroup.save()
                    .then(result => {
                        res.status(200).json({
                            status: 'success',
                            message: 'Group created succesfully'
                        });

                        const group_id = result.group_id;

                        const message = {
                            user_id,
                            bid,
                            group_id,
                            title,
                            desc,
                            created_at: new Date().toString()
                        };

                        const messageResult = sendMessages('employees_group_created', JSON.stringify(message));
                    })
                    .catch(error => {
                        console.log(error.message);
                        res.status(400).json({
                            status: 'failed',
                            message: error.message
                        });
                    });
            } else {
                res.status(400).json({
                    status: 'failed',
                    message: 'Not authorized'
                });
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.edit = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            // parameters
            const user_id = req.body.user_id;
            const group_id = req.body.group_id;
            const bid = req.body.bid;
            const title = req.body.title;
            const desc = req.body.desc;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/group/edit', {
                user_id: user_id,
                bid: bid
            });

            // Authorized user
            if (authorized.status === 'success') {
                await group.updateOne({group_id: group_id, bid: bid}, {
                    title: title,
                    desc: desc
                }, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    res.status(200).json({
                        status: 'success',
                        message: 'Group modify succesfully'
                    });


                    const message = {
                        user_id,
                        bid,
                        group_id,
                        title,
                        desc,
                        created_at: new Date().toString()
                    };

                    const messageResult = sendMessages('employees_group_updated', JSON.stringify(message));
                });
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.delete = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            // parameters
            const user_id = req.body.user_id;
            const group_id = req.body.group_id;
            const bid = req.body.bid;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/group/delete', {
                user_id: user_id,
                bid: bid
            });

            // Authorized user
            if (authorized.status === 'status') {
                await group.deleteOne({group_id: group_id, bid: bid}, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    res.status(200).json({
                        status: 'success',
                        message: 'Group delete succesfully'
                    });


                    const message = {
                        user_id,
                        bid,
                        group_id,
                        created_at: new Date().toString()
                    };

                    const messageResult = sendMessages('employees_group_deleted', JSON.stringify(message));
                });
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.list = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            // parameters
            const user_id = req.body.user_id;
            const bid = req.body.bid;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/group/list', {
                user_id: user_id,
                bid: bid
            });

            // Authorized user
            if (authorized.status === 'success') {
                await group.find({bid: bid}).select('group_id bid title desc')
                    .then(function (groups) {
                        res.send(groups);
                    }).catch(function (err) {
                        res.status(400).json({
                            status: 'failed',
                            message: e.message
                        });
                    });
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}