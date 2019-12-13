const Aerospike = require('aerospike');

const client = Aerospike.client({
    hosts: [
        { addr: "127.0.0.1", port: 3000 }
    ],
    log: {
        level: Aerospike.log.INFO
    },
    policies: {
      read: new Aerospike.ReadPolicy({
        key: Aerospike.policy.key.SEND
      })
    }
});

/**
 * Creates the database connextion
 * @returns Aerospike Client, already connected to the database
 */
module.exports = async function () {
  const connectionResult = await client.connect();
  if (connectionResult.error) {
    console.log('Error', error);
  } else {
    console.log('Database connected', connectionResult);
  }
  return client;
}
