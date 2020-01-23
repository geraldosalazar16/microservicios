const kafka = require('kafka-node');
const bp = require('body-parser');
const config = require('../config.json');

exports.sendMessages = (topic, messages) => {
    return new Promise((resolve, reject) => {
        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient({ kafkaHost: config.kafka.server });
        const producer = new Producer(client);

        let payloads = [
            {
                topic: topic,
                messages: messages
            }
        ];

        producer.on('ready', () => {
            producer.send(payloads, (err, data) => {
                if (err) {
                    resolve({
                        status: 'failed',
                        message: 'Broker update failed'
                    });
                } else {
                    resolve({
                        status: 'success',
                        message: 'Broker update success'
                    });
                }
            });
        });

        producer.on('error', (err) => {
            resolve({
                status: 'failed',
                message: err.message
            });
        });
    });
}
