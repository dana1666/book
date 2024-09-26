// const sql = require('mssql');

// const config = {
//     user: 'SA', // Replace with your Azure SQL username
//     password: 'Ttour123', // Replace with your Azure SQL password
//     server: 'localhost', // Replace with your Azure SQL server name
//     database: 'model', // Replace with your Azure SQL database name
//     options: {
//         encrypt: true, // Use this if you're on Windows Azure
//         trustServerCertificate: true, // Allows connection using self-signed certificates
//         enableArithAbort: true, // Ensures arithmetic errors are aborted
//     },
//     pool: {
//         max: 10, // Maximum number of connections in the pool
//         min: 0, // Minimum number of connections in the pool
//         idleTimeoutMillis: 30000 // How long a connection should remain idle before being closed
//     }
// };

// const poolPromise = new sql.ConnectionPool(config)
//     .connect()
//     .then(pool => {
//         console.log('Connected to SQL Server');
//         return pool;
//     })
//     .catch(err => {
//         console.log('Database Connection Failed! Bad Config: ', err);
//         throw err; // Rethrow the error after logging it
//     });

// module.exports = {
//     sql, poolPromise
// };

///00000

// const sql = require('mssql');

// const config = {
//     user: 'SA', // Replace with your Azure SQL username
//     password: 'Ttour123', // Replace with your Azure SQL password
//     server: 'localhost', // Replace with your Azure SQL server name
//     database: 'model', // Replace with your database name
//     options: {
//         encrypt: true, // Use encryption
//         trustServerCertificate: true, // Add this to trust self-signed certificates
//         enableArithAbort: true // Ensures arithmetic errors are aborted
//     }
// };

// const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
//     console.log('Connected to the database');
//     return pool;
// }).catch(err => {
//     console.log('Database Connection Failed! Bad Config: ', err);
//     throw err;
// });

// module.exports = {
//     sql,
//     poolPromise
// };

///loacl host version



// const sql = require('mssql');

// const config = {
//     user: process.env.DB_USER || 'SA',
//     password: process.env.DB_PASSWORD || 'Ttour123',
//     server: process.env.DB_SERVER || 'localhost', 
//     port: parseInt(process.env.DB_PORT, 10) || 1433,  // The port for the SQL Server
//     database: process.env.DB_DATABASE || 'model',
//     options: {
//         encrypt: false, 
//         trustServerCertificate: true,
//         enableArithAbort: true
//     }
// };

// // Log the configuration before making the connection
// console.log('Database Configuration: ', config);

// const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
//     console.log('Connected to the database');
//     return pool;
// }).catch(err => {
//     console.log('Database Connection Failed! Bad Config: ', err);
//     throw err;
// });

// module.exports = {
//     sql,
//     poolPromise
// };

///new version for new db

// const sql = require('mssql');

// const config = {
//     user: 'CloudSA7580c4cc@booksouqserver', // Replace with your Azure SQL username (e.g., 'your-username')
//     password: 'Jj123456789', // Replace with your Azure SQL password
//     server: 'booksouqserver.database.windows.net', // Azure SQL server name
//     database: 'booksouqdb', // Azure SQL database name
//     options: {
//         encrypt: true, // Mandatory for Azure
//         trustServerCertificate: false, // Do not use self-signed certificates for Azure SQL Database
//         enableArithAbort: true // Ensures arithmetic errors are aborted
//     },
//     pool: {
//         max: 10, // Maximum number of connections in the pool
//         min: 0,  // Minimum number of connections in the pool
//         idleTimeoutMillis: 30000 // How long a connection should remain idle before being closed
//     }
// };

// const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
//     console.log('Connected to the Azure SQL Database');
//     return pool;
// }).catch(err => {
//     console.log('Database Connection Failed! Bad Config: ', err);
//     throw err;
// });

// module.exports = {
//     sql,
//     poolPromise
// };
///-----

// const sql = require('mssql');

// const config = {
//     user: process.env.DB_USER || 'SA',  // Replace with your Azure SQL username
//     password: process.env.DB_PASSWORD || 'Ttour123',  // Replace with your Azure SQL password
//     server: process.env.DB_SERVER || 'localhost',  // Replace with your Azure SQL Server
//     port: parseInt(process.env.DB_PORT, 10) || 1433,  // The default port for SQL Server
//     database: process.env.DB_DATABASE || 'model',  // Replace with your Azure SQL Database name
//     options: {
//         encrypt: false,  // Use encryption when connecting to Azure SQL
//         trustServerCertificate: true,  // Should be false in production for Azure SQL
//         enableArithAbort: true
//     }
// };

// // Log the configuration before making the connection (optional, for debugging)
// console.log('Database Configuration: ', config);

// const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
//     console.log('Connected to the database');
//     return pool;
// }).catch(err => {
//     console.log('Database Connection Failed! Bad Config: ', err);
//     throw err;
// });

// module.exports = {
//     sql,
//     poolPromise
// };
//-------

// const { Pool } = require('pg');

// // Configuration for connecting to PostgreSQL using the Heroku-provided DATABASE_URL
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL || 'postgres://udei3luobo02km:p1dad4a5c83e83026472df379b5bb82a85742363d909c4f2ee92bfaa0af17982a@c5flugvup2318r.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d1ioi4pp2qa1k9',
//     ssl: {
//         rejectUnauthorized: false // Enable this for Heroku Postgres SSL connections
//     }
// });

// // Export the pool for use in your application
// module.exports = {
//     query: (text, params) => pool.query(text, params)
// };

//---

// const { Pool } = require('pg');

// // Use the provided connection string directly
// const connectionString = 'postgres://udei3luobo02km:p1dad4a5c83e83026472df379b5bb82a85742363d909c4f2ee92bfaa0af17982a@c5flugvup2318r.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d1ioi4pp2qa1k9';

// const pool = new Pool({
//   connectionString,
//   ssl: {
//     rejectUnauthorized: false,  // Required for connecting to Heroku Postgres with SSL
//   }
// });

// // Connect to the database
// pool.connect()
//   .then(() => console.log('Connected to the Heroku Postgres database'))
//   .catch(err => console.error('Database connection error:', err));

// module.exports = {
//   query: (text, params) => pool.query(text, params),  // Function to query the database
// };

//---

// const { Pool } = require('pg');

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL || 'postgres://udei3luobo02km:p1dad4a5c83e83026472df379b5bb82a85742363d909c4f2ee92bfaa0af17982a@c5flugvup2318r.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d1ioi4pp2qa1k9',
//     ssl: {
//         rejectUnauthorized: false // Required for cloud-hosted databases with self-signed certificates
//     },
//     connectionTimeoutMillis: 20000,  // 20 seconds
//     idleTimeoutMillis: 30000  // 30 seconds
// });

// pool.connect()
//     .then(() => console.log('Connected to the database'))
//     .catch(err => console.error('Failed to connect to the database:', err));

// module.exports = pool;

//---

// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'admin1',
//   host: 'my-bookstore-db.c5qmi8y26vsv.eu-north-1.rds.amazonaws.com',
//   database: 'bookstore',
//   password: 'Book123123!',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false  
// },
// connectionTimeoutMillis: 30000,  // 30 seconds
// idleTimeoutMillis: 30000, 
// });

// module.exports = pool;
//--------

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
});

 module.exports = pool;