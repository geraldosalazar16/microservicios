module.exports = (app) => {
    const filter = require('../controller/filter.controller')

    // Creates a new Filter
    app.post('/filter/create', filter.create);

    // Deletes a Filter
    app.post('/filter/delete', filter.delete);

    // List all filters
    app.post('/filter/list', filter.list);
    
}