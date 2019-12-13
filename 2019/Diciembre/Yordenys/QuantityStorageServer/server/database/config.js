const aerospikeClusterID = '127.0.0.1';
const aerospikeClusterPort = 3000;

exports.aerospikeConfig = () => {
    return {
        hosts: [
            { 
                addr: aerospikeClusterIP,
                port: aerospikeClusterPort
            }
        ]
    }
}

exports.aerospikeDBParams = () => {
    return {
        defaultNamespace: 'test',
        defaultSet: 'test'
    }
}