const kafka = require('kafka-node');
const config = require('../BusinessServer/config/config');

/**
 * @param {String} topic Kafka topic
 * @param {String} messages Message to send. It can be a single string, a KafkaMessage 
 * or an array of strings or KafkaMessage
 * @returns Promise with the result of sending the message
 */
module.exports = (topic, messages) => {
    return new Promise((resolve, reject) => {
        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient({ kafkaHost: config.kafka_server });
        const producer = new Producer(client);

        let payloads = [{
            topic: topic,
            messages: messages
        }];

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