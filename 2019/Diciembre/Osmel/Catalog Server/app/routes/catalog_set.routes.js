module.exports = (app) => {
    const catalog_set = require('../controller/catalog_set.controller')

    // Select a catalog set for a channel.
    app.post('/set/create', catalog_set.create);

    // Deletes a Catalog set.
    app.post('/set/delete', catalog_set.delete);

    // Get info of a set. 
    app.post('/set/info', catalog_set.info);

    // List all sets of this business 
    app.post('/set/list', catalog_set.list);

}