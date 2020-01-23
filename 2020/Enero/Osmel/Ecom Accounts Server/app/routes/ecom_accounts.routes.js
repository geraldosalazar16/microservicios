module.exports = (app) => {
    const ecommerce = require('../controller/ecom_accounts.controller.js')

    // Add a new ecommerce account to business.
    app.post('/ecomaccount/add', ecommerce.create);

    // Edits an account.
    app.post('/ecomaccount/edit', ecommerce.update);

    // Deletes an account.
    app.post('/ecomaccount/delete', ecommerce.delete);

    // List all accounts of business
    app.post('/ecomaccount/list', ecommerce.list);

    // Get account with same ID
    app.post('/ecomaccount/get', ecommerce.getById);

    // Get account with same type.
    app.post('/ecomaccount/getByType', ecommerce.getByType);

}