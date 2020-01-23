module.exports = (app) => {
    const channel_device = require('../controller/channel_device.controller')

    // Bind a device to a channel
    app.post('/ownership/bind', channel_device.bind);

    // Bind a group of devices to a channel
    app.post('/ownership/bindAll', channel_device.bindAll);

    // Unbind a device from a channel 
    app.post('/ownership/unbind', channel_device.unbind);

    // Unbind a group of devices from a channel 
    app.post('/ownership/unbindAll', channel_device.unbindAll);

    // Get bid and chid of a device
    app.post('/ownership/get', channel_device.get);

    // List devices of a channel
    app.post('/ownership/list', channel_device.list);



}