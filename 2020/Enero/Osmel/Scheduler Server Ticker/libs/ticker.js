'use strict';
var schedule = require('../app/models/schedule');
const { sendMessages } = require('../kafka');

exports.collect = () => {
    var now = new Date();
    var now_15 = new Date(now);
    now_15.setMinutes(now.getMinutes() + 15);
    schedule.find().
        where('done').equals(false).
        where('queed').equals(false).
        where('datetime').lte(now_15).
        where('datetime').gt(now).then(data => {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var record = data[i];
                    var recordMessage = {
                        payload: record
                    };
                    // Publish to kafka
                    const kafkaMessage = JSON.stringify(Object.assign(recordMessage));
                    sendMessages('Task_Queed', kafkaMessage);
                    record.queed = true;
                    record.save();
                }
            }
        });
}