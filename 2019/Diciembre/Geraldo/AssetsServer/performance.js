var loadtest = require('loadtest');
const options = {
    url: 'http://localhost:8000/device/invite',
    maxRequests: 100000,
    concurrency: 1,
    maxSeconds: 60,
    method: 'POST',
    requestsPerSecond: 100,
    body: {
        user_id: parseInt(Math.random()),
        bid: parseInt(Math.random()),
        title: parseInt(Math.random()),
        desc: parseInt(Math.random())
    },
    contentType: 'application/x-www-form-urlencoded',
    statusCallback: statusCallback
};

loadtest.loadTest(options, function(error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully');
});

function statusCallback(error, result, latency) {
    console.log('Current latency %j, result %j, error %j', latency, result, error);
    console.log('----');
    console.log('Request elapsed milliseconds: ', result.requestElapsed);
    console.log('Request index: ', result.requestIndex);
    console.log('Request loadtest() instance index: ', result.instanceIndex);
}