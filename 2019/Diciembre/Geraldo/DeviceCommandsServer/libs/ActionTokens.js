'use strict';

exports.createStandard = async (p1, p2, p3, p4, p5, p6) => {
    return {
        status: 'success',
        message: 'Success',
        token: Math.round(Math.random() * 10000).toString()
    };
}

exports.use = async (p1, p2, p3) => {
    return {
        status: 'success',
        message: 'Success',
        payload: {
            carrier_type: 'list',
            carrier_list: [
                '123'
            ],
            target_type: 'list',
            target_list: [
                '123'
            ],
            code: '123',
            createt_at: '123',
            args: '123'
        }
    };
}