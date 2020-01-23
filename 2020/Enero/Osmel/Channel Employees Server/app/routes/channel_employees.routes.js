module.exports = (app) => {
    const members = require('../controller/channel_employees.controller')

    // Bind a user to a channel.
    app.post('/members/bind', members.bind);

    // Bind a list of users to a channel.
    app.post('/members/bindAll', members.bindAll);

    // Update role of employee.
    app.post('/members/updateRole', members.updateRole);

    // Unbind a user from a channel. 
    app.post('/members/unbind', members.unbind);

    // Unbind a list of users from a channel.
    app.post('/members/unbindAll', members.unbindAll);

}