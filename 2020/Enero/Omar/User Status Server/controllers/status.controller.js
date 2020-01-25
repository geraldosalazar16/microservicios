const {validationResult} = require('express-validator');
const Authorization = require('../lib/Authorization');
const db_redis = require('../database');


exports.setstate = async function (req, res) {
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
            const state = req.body.state;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('userstatus/state/set', {
                user_id: user_id,
                state: state
            });

            if (authorized.status === 'success') {
                const result = await db_redis.setstate(user_id, state);
                if (result.status === 'success') {
                    res.status(200).json({
                        status: 'success',
                        message: result.message
                    });
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: result.message
                    });
                }
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.getstate = async function (req, res) {
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

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('userstatus/state/get', {
                user_id: user_id
            });

            if (authorized.status === 'success') {
                const result = await db_redis.getstate(user_id);
                if (result.status === 'success') {
                    res.status(200).json({
                        status: 'success',
                        message: result.message
                    });
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: result.message
                    });
                }
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.setstatus = async function (req, res) {
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
            const status = req.body.status;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('userstatus/status/set', {
                user_id: user_id,
                status: status
            });

            if (authorized.status === 'success') {
                const result = await db_redis.setstatus(user_id, status);
                if (result.status === 'success') {
                    res.status(200).json({
                        status: 'success',
                        message: result.message
                    });
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: result.message
                    });
                }
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.getstatus = async function (req, res) {
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

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('userstatus/status/get', {
                user_id: user_id
            });

            if (authorized.status === 'success') {
                const result = await db_redis.getstatus(user_id);
                if (result.status === 'success') {
                    res.status(200).json({
                        status: 'success',
                        message: result.message
                    });
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: result.message
                    });
                }
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.setlastseen = async function (req, res) {
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
            const lastseen = req.body.lastseen;

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('userstatus/lastseen/set', {
                user_id: user_id,
                lastseen: lastseen
            });

            if (authorized.status === 'success') {
                const result = await db_redis.setlastseen(user_id, lastseen);
                if (result.status === 'success') {
                    res.status(200).json({
                        status: 'success',
                        message: result.message
                    });
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: result.message
                    });
                }
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


exports.getlastseen = async function (req, res) {
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

            // authorization
            const auth = new Authorization();
            const authorized = auth.authorize('userstatus/lastseen/get', {
                user_id: user_id
            });

            if (authorized.status === 'success') {
                const result = await db_redis.getlastseen(user_id);
                if (result.status === 'success') {
                    res.status(200).json({
                        status: 'success',
                        message: result.message
                    });
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: result.message
                    });
                }
            }
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}