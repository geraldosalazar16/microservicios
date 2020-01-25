const Authorization = require('../lib/Authorization');
const {validationResult} = require('express-validator');
const {sendMessages} = require('../kafka');
const uuidv4 = require('uuid/v4');
const timesheet = require('../models/timesheet.model');


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
            const group_id = req.body.group_id;
            const title = req.body.title;
            const desc = req.body.desc;
            const time_range = req.body.time_range;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/timesheet/create', {
                user_id: user_id,
                bid: bid,
                group_id: group_id
            });

            // Authorized user
            if (authorized.status === 'success') {
                const newTimeSheet = new timesheet({
                    sheet_id: uuidv4(),
                    user_id: user_id,
                    bid: bid,
                    group_id: group_id,
                    title: title,
                    desc: desc,
                    daterange: JSON.parse(time_range)
                });

                await newTimeSheet.save()
                    .then(result => {
                        res.status(200).json({
                            status: 'success',
                            message: 'Timesheet created succesfully'
                        });

                        const message = {
                            user_id,
                            bid,
                            group_id,
                            title,
                            desc,
                            time_range,
                            created_at: new Date().toString()
                        };

                        const messageResult = sendMessages('employees_timesheet_created', JSON.stringify(message));
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
            const bid = req.body.bid;
            const group_id = req.body.group_id;
            const sheet_id = req.body.sheet_id;
            const title = req.body.title;
            const desc = req.body.desc;
            const time_range = req.body.time_range;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/timesheet/edit', {
                user_id: user_id,
                bid: bid,
                group_id: group_id,
                sheet_id: sheet_id
            });

            // Authorized user
            if (authorized.status === 'success') {
                await timesheet.updateOne({bid: bid, group_id: group_id, sheet_id: sheet_id}, {
                    title: title,
                    desc: desc,
                    group_id: group_id,
                    daterange: JSON.parse(time_range)
                }, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    res.status(200).json({
                        status: 'success',
                        message: 'Timesheet modify succesfully'
                    });


                    const message = {
                        user_id,
                        bid,
                        group_id,
                        sheet_id,
                        time_range,
                        title,
                        desc,
                        created_at: new Date().toString()
                    };

                    const messageResult = sendMessages('employees_timesheet_update', JSON.stringify(message));
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
            const bid = req.body.bid;
            const sheet_id = req.body.sheet_id;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/timesheet/delete', {
                user_id: user_id,
                bid: bid,
                sheet_id: sheet_id
            });

            // Authorized user
            if (authorized.status === 'success') {
                await timesheet.deleteOne({sheet_id: sheet_id, bid: bid}, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    res.status(200).json({
                        status: 'success',
                        message: 'Timesheet delete succesfully'
                    });


                    const message = {
                        user_id,
                        bid,
                        //group_id,
                        created_at: new Date().toString()
                    };

                    const messageResult = sendMessages('employees_timesheet_delete', JSON.stringify(message));
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
