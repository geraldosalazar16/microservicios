const Authorization = require('../libs/Authorization');
const ActionTokens = require('../libs/ActionTokens');
const membership = require('../models/membership.model');
const {validationResult} = require('express-validator');
const {sendMessages} = require('../kafka');
const Roles = require('../libs/Roles');
const IdGenerator = require('../libs/Generator');


/**
 *
 * @param req
 * @param res
 * @returns {Promise<{message: string, invitationCode: *, status: string}>}
 */
exports.invite = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            const auth = new Authorization();

            const method = req.body.method;
            const user_id = req.body.user_id;
            const bid = req.body.bid;
            const dep_id = req.body.dep_id;
            const role_id = req.body.role_id;

            const authorized = auth.authorize('/business/membership/invite', {
                user_id: user_id,
                bid: bid,
                dep_id: dep_id,
                role_id: role_id,
                method: method
            });

            // Authorized user
            if (authorized) {
                if (method == 'code' || !method) {
                    const at = new ActionTokens();
                    const invitationCode = at.createAlphanumeric(
                        true,
                        1,
                        user_id,
                        'business_membership',
                        'joined_business',
                        {
                            dep_id: dep_id,
                            role_id: role_id,
                            by: user_id,
                            bid: bid
                        },
                        600000
                    );

                    const message = {
                        user_id,
                        bid,
                        dep_id,
                        role_id,
                        method,
                        created_at: new Date().toString()
                    };

                    const messageResult = await sendMessages('business_membership_invite_created', JSON.stringify(message));

                    return {
                        status: 'success',
                        message: 'Device invited successfully',
                        invitationCode
                    };
                } else {
                    res.status(400).json({
                        status: 'failed',
                        message: 'Method not supported'
                    });
                }
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


/**
 * Join via invitation code
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.join = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            var roles = new Roles();
            var generator = new IdGenerator();

            const user_id = req.body.user_id;
            const invitation_code = req.body.invitation_code;

            const auth = new Authorization();
            const authorized = auth.authorize('/business/membership/join', {
                user_id: user_id
            });

            if (authorized) {
                const at = new ActionTokens();

                var payload = at.use(user_id, invitation_code, 'business_membership');

                if (payload) {
                    // role
                    membership.findOne({user_id: user_id, bid: payload.bid}).then(function (listMember) {
                        if (listMember) {
                            res.status(400).json({
                                status: 'failed',
                                message: 'Not authorized'
                            });
                        } else {
                            var permission_ids = roles.getPermissions(payload.bid, payload.role_id);
                            var emp_id = generator.getNextId();

                            var newMember = new membership({
                                bid: payload.bid,
                                user_id: user_id,
                                emp_id: emp_id,
                                department: payload.dep_id,
                                role: payload.role_id,
                                permissions: permission_ids,
                                added_by: payload.by,
                                added_at: new Date().toString(),
                                temporary: false,
                                revoked: false
                            });

                            newMember.save().then(async function (mem) {
                                const payload_bid = payload.bid;
                                const payload_by = payload.by;
                                const payload_role_id = payload.role_id;
                                const payload_dep_id = payload.dep_id;

                                const message = {
                                    user_id,
                                    invitation_code,
                                    payload_bid,
                                    payload_by,
                                    payload_role_id,
                                    payload_dep_id,
                                    current_time: new Date().toString()
                                };

                                const messageResult = await sendMessages('business_membership_invite_created', JSON.stringify(message));

                                res.status(200).json({
                                    status: 'success',
                                    message: 'Join invitation successfully'
                                });
                            }).catch(function (err) {
                                res.status(400).json({
                                    status: 'failed',
                                    message: err.message
                                });
                            })
                        }
                    })
                } else {
                    const message = {
                        user_id,
                        invitation_code,
                        current_time: new Date().toString()
                    };

                    const messageResult = await sendMessages('business_membership_join_failed', JSON.stringify(message));

                    res.status(400).json({
                        status: 'failed',
                        message: 'Not authorized'
                    });
                }
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


/**
 * Request to revoke some other user from his position
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.revoke = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            const user_id = req.body.user_id;
            const bid = req.body.bid;
            const target_user = req.body.target_user;

            const auth = new Authorization();
            const authorized = auth.authorize('/business/membership/revoke', {
                user_id: user_id,
                bid: bid,
                target: target_user
            });

            if (authorized) {
                // Delete
                membership.deleteOne({user_id: target_user, bid: bid}, async function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.deletedCount == 0) {
                        return res.status(201).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        const message = {
                            user_id,
                            target_user,
                            bid,
                            created_at: new Date().toString()
                        };
                        const messageResult = await sendMessages('business_membership_user_left_business', JSON.stringify(message));

                        return res.status(200).json({
                            status: 'success',
                            message: 'Membership revoke succesfully'
                        });
                    }
                });
            } else {
                res.status(400).json({
                    status: 'failed',
                    message: 'Not authorized'
                });
            }
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Request to leave the position in system
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.leave = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            const user_id = req.body.user_id;
            const bid = req.body.bid;

            const auth = new Authorization();
            const authorized = auth.authorize('/business/membership/leave', {
                user_id: user_id,
                bid: bid
            });

            if (authorized) {
                // Delete
                membership.deleteOne({user_id: user_id, bid: bid}, async function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.deletedCount == 0) {
                        return res.status(201).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        const message = {
                            user_id,
                            bid,
                            created_at: new Date().toString()
                        };
                        const messageResult = await sendMessages('business_membership_user_left_business', JSON.stringify(message));

                        return res.status(200).json({
                            status: 'success',
                            message: 'Membership removed succesfully'
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Not authorized'
                });
            }
        }
    } catch (e) {
        return res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * List members of a business
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
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
            const user_id = req.body.user_id;
            const bid = req.body.bid;

            const auth = new Authorization();
            const authorized = auth.authorize('/business/membership/list', {
                user_id: user_id,
                bid: bid
            });

            if (authorized) {
                await membership.find({bid: bid}).then(function (listM) {
                    return res.send({
                        status: 'success',
                        business: listM
                    });
                }).catch(function (err) {
                    return res.status(400).json({
                        status: 'failed',
                        message: err.message
                    });
                });
            } else {
                return res.status(400).json({
                    status: 'failed',
                    message: 'Not authorized'
                });
            }
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Get role of user in business
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getrole = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            await membership.find({
                user_id: req.body.user_id,
                bid: req.body.bid
            }).then(function (memberships) {
                if (memberships.length == 0) {
                    res.status(400).json({
                        status: 'failed',
                        message: "There is no item with this search criteria"
                    });
                } else {
                    res.send(memberships[0].role);
                }
            }).catch(function (err) {
                res.status(400).json({
                    status: 'failed',
                    message: err.message
                });
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Get role of user in business
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getpermissions = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            await membership.find({
                user_id: req.body.user_id,
                bid: req.body.bid
            }).then(function (memberships) {
                if (memberships.length == 0) {
                    res.status(400).json({
                        status: 'failed',
                        message: "There is no item with this search criteria"
                    });
                } else {
                    if (memberships[0].role == '_owner') {
                        return res.send('_all');
                    } else {
                        return res.send(memberships[0].permissions);
                    }
                }
            }).catch(function (err) {
                res.status(400).json({
                    status: 'failed',
                    message: err.message
                });
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Get department of user in business
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getdepartment = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            await membership.findOne({
                user_id: req.body.user_id,
                bid: req.body.bid
            }).then(function (listDepartm) {
                if (!listDepartm) {
                    res.status(400).json({
                        status: 'failed',
                        message: "There is no item with this search criteria"
                    });
                } else {
                    res.send(listDepartm.department);
                }
            }).catch(function (err) {
                res.status(400).json({
                    status: 'failed',
                    message: err.message
                });
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Get department of user in business
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.userHasPermission = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            await membership.findOne({
                user_id: req.body.user_id,
                bid: req.body.bid
            }).then(function (memberships) {
                if (!memberships) {
                    res.status(200).json({
                        status: 'success',
                        message: 'There is no item with this search criteria'
                    });
                } else {
                    if (memberships.role == '_owner') {
                        res.status(200).json({
                            status: 'success',
                            message: 'Found permission'
                        });
                    } else {
                        var found = memberships.permissions.find(function (element) {
                            return element == req.body.permission;
                        });

                        if (found == null) {
                            res.status(400).json({
                                status: 'success',
                                message: 'Not found permission'
                            });
                        } else {
                            res.status(200).json({
                                status: 'failed',
                                message: 'Found permission'
                            });
                        }
                    }
                }
            }).catch(function (err) {
                res.status(400).json({
                    status: 'failed',
                    message: err.message
                });
            });
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Check user is owner of this business
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.isowner = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            await membership.findOne({
                user_id: req.body.user_id,
                bid: req.body.bid
            }).then(function (memberships) {
                if (!memberships) {
                    res.status(201).json({
                        status: 'success',
                        message: 'There is no item with this search criteria'
                    });
                } else {
                    if (memberships.role == '_owner') {
                        res.status(200).json({
                            status: 'success',
                            message: 'Found users'
                        });
                    } else {
                        res.status(400).json({
                            status: 'failed',
                            message: 'Not user owner'
                        });
                    }
                }
            }).catch(function (err) {
                res.status(400).json({
                    status: 'failed',
                    message: err.message
                });
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}