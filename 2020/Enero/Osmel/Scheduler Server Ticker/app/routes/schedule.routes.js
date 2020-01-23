module.exports = (app) => {
    const task = require('../controller/schedule.controller')

    // Add a new task.
    app.post('/task/create', task.create);

    // Deletes an task.
    app.post('/task/delete', task.delete);

}