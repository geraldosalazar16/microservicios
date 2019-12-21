const kafka = require('kafka-node');
const topicHandlers = require('./topicHandlers');
const config = require('../config.json');
// const client = new kafka.KafkaClient({ kafkaHost: config.kafka.server });

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

exports.listen = () => {
    Consumer = kafka.Consumer;
    const client = new kafka.KafkaClient({ kafkaHost: config.kafka.server });
    consumer = new Consumer(
        client,
        [
            {
                topic: 'quantity_set',
                partition: config.kafka.partition
            },
            {
                topic: 'quantity_updated',
                partition: config.kafka.partition
            }
        ],
        {
            autoCommit: false
        }
    );

    consumer.on('message', (message) => {
        topicHandlers[message.topic](message);
    });

    consumer.on('error', (err) => {})
}
