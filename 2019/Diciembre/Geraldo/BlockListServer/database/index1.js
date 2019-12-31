const { Client, Pool } = require('pg');
const config = require('../config.json');
const pool = new Pool(config.postgres);
// const client = new Client(config.postgres);

exports.init = async () => {
    // Create tables if not exist
    // white_peers
    let query = "CREATE TABLE IF NOT EXISTS white_peers (\
        chid VARCHAR(50) PRIMARY KEY,\
        peer_id VARCHAR(45) NOT NULL);";
    pool.query(query);
    // black_peers
    query = "CREATE TABLE IF NOT EXISTS black_peers (\
                chid VARCHAR(50) PRIMARY KEY,\
                peer_id VARCHAR(45) NOT NULL,\
                temporary BOOLEAN NOT NULL,\
                till DATE NOT NULL\
              );";
    pool.query(query);
    // policy
    query = "CREATE TABLE IF NOT EXISTS policy (\
                chid VARCHAR(50) NOT NULL,\
                policy VARCHAR(50) NOT NULL\
              );";
    pool.query(query);
    return true;
}

exports.query = async (query) => {
    const client = await pool.connect();
    try {
        return await client.query(query);
    } catch(err) {
        return false;
    }
    finally {
        // Make sure to release the client before any error handling,
        // just in case the error handling itself throws an error.
        client.release()
    }
}

/*
const mysql      = require('mysql');
const config = require('../config.json');
const connection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});

exports.connect = () => {
    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if (error) {
                reject(error);
            }
            resolve(true);
            // Create tables if not exist
            // black_peers
            let query = "CREATE TABLE IF NOT EXISTS black_peers (\
                chid varchar(50) NOT NULL,\
                peer_id varchar(45) NOT NULL,\
                temporary tinyint(4) NOT NULL,\
                till datetime NOT NULL,\
                PRIMARY KEY (chid)\
              ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
            connection.query(query);
            // policy
            query = "CREATE TABLE IF NOT EXISTS policy (\
                chid varchar(50) NOT NULL,\
                policy enum('whitelist','blacklist') NOT NULL,\
                PRIMARY KEY (chid)\
              ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
            connection.query(query);
            // white_peers
            query = "CREATE TABLE IF NOT EXISTS white_peers (\
                chid varchar(50) NOT NULL,\
                peer_id varchar(45) NOT NULL,\
                PRIMARY KEY (chid)\
              ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
            connection.query(query);
        });
    });
}

exports.query = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    })
}
*/