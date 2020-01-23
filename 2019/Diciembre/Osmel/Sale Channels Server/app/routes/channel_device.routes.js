module.exports = (app) => {
    const device = require('../controller/channel_device.controller.js')

    // Creates a new device
    app.post('/device/add', device.create);

    // Edits a device
    app.post('/device/remove', device.remove);

    // Get all Devices
    app.post('/device/list', device.list);

    // Get all Devices
    app.post('/device/info', device.info);
    
}