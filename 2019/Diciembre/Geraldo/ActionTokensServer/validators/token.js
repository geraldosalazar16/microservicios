const filterScan = require('../helpers/filterScan');
const makeDb = require('../database')

exports.tokenCredentials = async ({ clientId, clientSecret }, scan) => {
    // clientId and clientSecret should be found in the clients table
    const result = await filterScan(scan, { field: 'clientId', value: clientId });
    if (result.status === 'success') {
        // client shoud be Active=TRUE
        const client = result.record;
        return client.clientSecret === clientSecret && client.active === 'true';
    } else {
        return false;
    }
}

exports.tokenExist = async (uuid, scan) => {
    const result = await filterScan(scan, { field: 'token', value: uuid });
    if (result.status === 'success') {
        return true;
    } else {
        return false;
    }
}