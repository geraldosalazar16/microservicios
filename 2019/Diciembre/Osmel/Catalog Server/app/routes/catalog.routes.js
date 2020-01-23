module.exports = (app) => {
    const catalog = require('../controller/catalog.controller.js')

    // Creates a new Catalog
    app.post('/catalog/create', catalog.create);

    // Edits a Catalog
    app.post('/catalog/edit', catalog.update);

    // Delete a Catalog
    app.post('/catalog/delete', catalog.delete);
    
    // List all catalogs of businees
    app.post('/catalog/list', catalog.list);

    // List all catalogs of business based on category
    app.post('/catalog/listByCategory', catalog.listByCategory);

    // List all catalogs of business based on department.
    app.post('/catalog/listByDepartment', catalog.listByDepartment);

    // List all catalogs of business based on tags.
    app.post('/catalog/listByTags', catalog.listByTags);



    

}