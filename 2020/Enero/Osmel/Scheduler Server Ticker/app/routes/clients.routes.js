module.exports = (app) => {
    const client = require('../controller/client.controller')

    // Add a new client.
    app.post('/clients/create', client.create);

    // Deletes an client.
    app.post('/clients/delete', client.delete);

    // Blocks a Client.
    app.post('/clients/block', client.block);

    // Unblocks a Client
    app.post('/clients/unblock', client.unblock);

    // List of all clients
    app.post('/clients/list', client.list);
}