var loadtest = require('loadtest');
var should = require('should');
describe("Performance Test", function() {
  var noRequestPerHour = 100000;
  var avgRequestTime = 1000;
    
  it("performance testing /device/invite", function(done) {
    this.timeout(1000 * 60);
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
  var gLatency;
  function statusCallback(latency, result, error) {
    gLatency = latency;
  }
  var operation = loadtest.loadTest(options, function(error) {
    if (error) {
      console.error('Got an error: %s', error);
    } else if (operation.running == false) {
      console.info("\n==============================\n");
      console.info("Requests per hour: " + noRequestPerHour)
      console.info("Avg request time(Millis): " + avgRequestTime)
      console.info("\n==============================\n")
      console.info("Total Requests :", gLatency.totalRequests);
      console.info("Total Failures :", gLatency.totalErrors);
      console.info("Requests/Second :", gLatency.rps);
      console.info("Requests/Hour :", (gLatency.rps * 3600));
      console.info("Avg Request Time:",gLatency.meanLatencyMs);
      console.info("Min Request Time:",gLatency.minLatencyMs);
      console.info("Max Request Time:",gLatency.maxLatencyMs);
      console.info("Percentiles :", gLatency.percentiles)
      console.info("\n===============================\n")
      gLatency.totalErrors.should.equal(0);
      (gLatency.rps * 3600).should.be.greaterThan(noRequestPerHour);
      (gLatency.meanLatencyMs).should.be.below(avgRequestTime);
      done();
   }
  });
 });
});