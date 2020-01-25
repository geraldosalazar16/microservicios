const Authorization = require('../lib/Authorization');
const {validationResult} = require('express-validator');
const {sendMessages} = require('../kafka');
const clock = require('../models/clock.model');


exports.clockin = async function (req, res) {
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
            const emp_id = req.body.emp_id;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/clock/clockin', {
                user_id: user_id,
                bid: bid,
                emp_id: emp_id
            });

            // Authorized user
            if (authorized.status === 'success') {
                const at = new Date();
                let month = at.getMonth() + 1;
                if (month < 10)
                    month = "0" + month.toString();
                const day = at.getFullYear().toString() + month + at.getDate().toString();

                const newClock = new clock({
                    emp_id: emp_id,
                    bid: bid,
                    event: "clock-in",
                    at: at.toString(),
                    day: at.getFullYear().toString() + month + at.getDate().toString()
                });

                await newClock.save()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            status: 'success',
                            message: 'Clock in succesfully'
                        });

                        const message = {
                            user_id,
                            emp_id,
                            at: at.toString(),
                            day,
                            created_at: new Date().toString()
                        };

                        const messageResult = sendMessages('employees_clocked_in', JSON.stringify(message));
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


exports.clockout = async function (req, res) {
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
            const emp_id = req.body.emp_id;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/clock/clockin', {
                user_id: user_id,
                bid: bid,
                emp_id: emp_id
            });

            // Authorized user
            if (authorized.status === 'success') {
                const at = new Date();
                let month = at.getMonth() + 1;
                if (month < 10)
                    month = "0" + month.toString();
                const day = at.getFullYear().toString() + month + at.getDate().toString();

                const newClock = new clock({
                    emp_id: emp_id,
                    bid: bid,
                    event: "clock-out",
                    at: at.toString(),
                    day: at.getFullYear().toString() + month + at.getDate().toString()
                });

                await newClock.save()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            status: 'success',
                            message: 'Clock out succesfully'
                        });

                        const message = {
                            user_id,
                            emp_id,
                            at: at.toString(),
                            day,
                            created_at: new Date().toString()
                        };

                        const messageResult = sendMessages('employees_clocked_out', JSON.stringify(message));
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
            const emp_id = req.body.emp_id;
            let daterange = req.body.daterange

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/clock/list', {
                user_id: user_id,
                bid: bid,
                emp_id: emp_id
            });

            // Authorized user
            if (authorized.status === 'success') {
                let listClock = new Array();

                for (const date of JSON.parse(daterange)) {
                    await clock.find({bid: bid, emp_id: emp_id, day: date}).then(function (listM) {
                        if (listM.length > 0) {
                            for (const item of listM) {
                                const result = listClock.findIndex(elemt => elemt === item.day);
                                if (result == -1)
                                    listClock.push(item.day);
                            }
                        }
                    }).catch(function (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    clocks: listClock
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


exports.gettimes = async function (req, res) {
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
            const emp_id = req.body.emp_id;
            let daterange = req.body.daterange;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('employees/clock/calculate', {
                user_id: user_id,
                bid: bid,
                emp_id: emp_id
            });

            // Authorized user
            if (authorized.status === 'success') {
                let listClock = new Array();
                console.log(daterange);

                for (const date of daterange) {
                    await clock.find({bid: bid, emp_id: emp_id, day: date}).then(function (listM) {
                        if (listM.length > 0)
                            listClock.push(listM.day);
                    }).catch(function (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    });
                }

                return res.status(200).json({
                    status: 'success',
                    clocks: listClock
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
