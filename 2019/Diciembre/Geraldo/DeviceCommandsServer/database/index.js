const MongoClient = require('mongodb').MongoClient;

exports.init = async (config) => {
    const client = new MongoClient(config.url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    return await connect(client, config.dbName);
}

const connect = (client, dbName) => {
    return new Promise((resolve, reject) => {
        client.connect((error) => {
            if (error) {
                reject(error);
            }
            const db = client.db(dbName);
            resolve(db);
        });
    })
}