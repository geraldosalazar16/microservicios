const schedule = require('../models/schedule');
var randomId = require('../../libs/randomUUID');
const { sendMessages } = require('../../kafka');

// Create and Save a new schedule
exports.create = (req, res) => {

    var clienteId = req.body.clienteId;
    var clientSecret = req.body.clientSecret;
    var target = req.body.target;
    var payload = req.body.payload;
    var datetime = new Date(req.body.datetime);
    var endpoints = req.body.endpoints;
    var task = {
        target: target,
        payload: payload
    };
    var now = new Date();
    var now_30 = new Date(now);
    now_30.setMinutes(now.getMinutes() + 30);

    // Verify datetime
    if (now.getTime() > datetime.getTime()) {
        res.status(403).send({
            status: 'Failed',
            message: 'Error: Invalid time rangue'
        });
    } else if (datetime.getTime() < now_30.getTime()) {
        res.status(403).send({
            status: 'Failed',
            message: 'Error: Too close'
        });

    } else {
        var request_code = randomId.UUID();

        // Create a schedule
        const scheduleSchema = new schedule({
            request_code: request_code,
            datetime: datetime,
            endpoints: endpoints,
            done: false,
            queed: false,
            task: task
        });

        scheduleMessage = {
            request_code: request_code,
            target: target,
            payload: payload,
            datetime: datetime,
            endpoints: endpoints,
            created_at: new Date(),
        }

        // Save schedule in the database
        scheduleSchema.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(scheduleMessage));
            sendMessages('task_created', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Schedule created',
                data: request_code
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the Schedule."
            });
        });

    }
}

// Delete an schedule 
exports.delete = (req, res) => {
    var clienteId = req.body.clienteId;
    var clientSecret = req.body.clientSecret;
    var request_code = req.body.request_code;
    var now = new Date();

    // Validate request 
    if (!request_code) {
        return res.status(400).send({
            status: 'Failed',
            message: "The request_code parameter cannot be empty"
        });
    } else {
        schedule.findOneAndDelete().
            where('request_code').equals(request_code).then(data => {
                record = data;
                datetime = new Date(record.datetime);

                if (datetime.getTime() < now.getTime() || record.done == true) {
                    return res.status(400).send({
                        status: 'Failed',
                        message: "Error: Task already expired"
                    });
                } else {

                    recordMessage = {
                        request_code: request_code,
                        target: record.target,
                        payload: record.payload,
                        datetime: record.datetime,
                        endpoints: record.endpoints,
                        created_at: new Date()
                    }

                    //   Publish to kafka
                    const kafkaMessage = JSON.stringify(Object.assign(recordMessage));
                    sendMessages('task_deleted', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Schedule has been deleted'
                    });
                }
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while deleted the Schedule."
                });
            });

    }
}

// Calculate difference minutes
diffMinutes = (datetime, now) => {
    var diff = (now.getTime() - datetime.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
