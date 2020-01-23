module.exports = (app) => {
    const channel = require('../controller/channel.controller.js')

    // Creates a new Catalog
    app.post('/channel/create', channel.create);

    // Edits a channel
    app.post('/channel/edit', channel.update);

    // Delete a channel
    app.post('/channel/delete', channel.delete);

}