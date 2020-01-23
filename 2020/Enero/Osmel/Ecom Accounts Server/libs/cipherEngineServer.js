'use strict';

exports.encrypt = (credential_string, request_id, method) => {
    // Example Json 
    return {
        content: 'CONTENT-EDITADO',
        reference: 'REFERENCE-EDITADO'
    };
}

exports.decrypt = (credential_string, request_id, method) => {
    // Example Json | String
    return JSON.stringify({
        content: 'TEST',
        reference: 'TEST-EXAMPLE'
    });
}