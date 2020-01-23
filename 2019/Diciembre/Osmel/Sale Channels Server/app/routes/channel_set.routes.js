module.exports = (app) => {
    const channel_set = require('../controller/channel_set.controller.js')

    // Select a catalog set for a channel.
    app.post('/catalogset/assign', channel_set.assing);

    // Remove set from channel.
    app.post('/catalogset/revoke', channel_set.revoke);

    // Get set info of a channel.
    app.post('/catalogset/info', channel_set.info);

}