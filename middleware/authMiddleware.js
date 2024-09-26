
// const jwt = require('jsonwebtoken');

// const authMiddleware = () => {
//     return (req, res, next) => {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             console.log('Access Denied: No token provided.');
//             return res.status(401).send('Access Denied. No token provided.');
//         }

//         try {
           
//             const decoded = jwt.verify(token, 'your_jwt_secret_key'); 
//             req.user = decoded;  
//             console.log(`Access granted: User role "${req.user.role}"`);
//             next(); 
//         } catch (err) {
//             console.error('Invalid token:', err.message);
//             res.status(400).send('Invalid token.');
//         }
//     };
// };

// module.exports = authMiddleware;
//--------------------

// const jwt = require('jsonwebtoken');

// const authMiddleware = () => {
//     return (req, res, next) => {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             console.log('Access Denied: No token provided.');
//             return res.status(401).send('Access Denied. No token provided.');
//         }

//         try {
//             // Use environment variable for JWT secret key
//             const secretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key'; 
//             const decoded = jwt.verify(token, secretKey);
//             req.user = decoded;  
//             console.log(`Access granted: User role "${req.user.role}"`);
//             next(); 
//         } catch (err) {
//             console.error('Invalid token:', err.message);
//             res.status(400).send('Invalid token.');
//         }
//     };
// };

// module.exports = authMiddleware;

//===========

// const jwt = require('jsonwebtoken');
// const { Pool } = require('../config/dbConfig'); // Import pg pool for optional user verification

// const authMiddleware = () => {
//     return async (req, res, next) => {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             console.log('Access Denied: No token provided.');
//             return res.status(401).send('Access Denied. No token provided.');
//         }

//         try {
//             // Use environment variable for JWT secret key
//             const secretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key'; 
//             const decoded = jwt.verify(token, secretKey);
//             req.user = decoded;  
//             console.log(`Access granted: User role "${req.user.role}"`);

//             // Optional: Verify if the user still exists in the database (e.g., for role changes or deactivation)
//             const pool = new Pool();
//             const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [req.user.userId]);
//             if (userResult.rows.length === 0) {
//                 return res.status(401).send('User not found or deactivated.');
//             }

//             // Close the connection after the query (if using connection pooling)
//             pool.end();

//             next();  // Call the next middleware or route handler
//         } catch (err) {
//             if (err.name === 'TokenExpiredError') {
//                 console.error('Token has expired:', err.message);
//                 return res.status(401).send('Token has expired. Please log in again.');
//             }

//             console.error('Invalid token:', err.message);
//             return res.status(400).send('Invalid token.');
//         }
//     };
// };


// const authMiddleware = () => {
//     return async (req, res, next) => {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             console.log('Access Denied: No token provided.');
//             return res.status(401).send('Access Denied. No token provided.');
//         }

//         try {
//             const secretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key'; 
//             const decoded = jwt.verify(token, secretKey);
//             req.user = decoded;

//             // Optional: Verify user existence in DB if you need more security
//             const pool = new Pool();
//             const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [req.user.userId]);
//             if (userResult.rows.length === 0) {
//                 return res.status(401).send('User not found or deactivated.');
//             }

//             pool.end();  // Close connection to avoid leaks
//             next();
//         } catch (err) {
//             if (err.name === 'TokenExpiredError') {
//                 console.error('Token has expired:', err.message);
//                 return res.status(401).send('Token has expired. Please log in again.');
//             }

//             console.error('Invalid token:', err.message);
//             return res.status(400).send('Invalid token.');
//         }
//     };
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const { Pool } = require('../config/dbConfig'); // Import db connection pool

// const authMiddleware = () => {
//     return async (req, res, next) => {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             console.log('Access Denied: No token provided.');
//             return res.status(401).send('Access Denied. No token provided.');
//         }

//         try {
//             const secretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key';
//             const decoded = jwt.verify(token, secretKey);  // Verify the token with the secret key
//             req.user = decoded;

//             console.log(`Token Validated for User ID: ${req.user.userId}`);

//             // Optionally, check if user still exists in the database
//             const pool = new Pool();
//             const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [req.user.userId]);

//             if (userResult.rows.length === 0) {
//                 return res.status(401).send('User not found or deactivated.');
//             }

//             next();  // Pass the control to the next middleware or route handler
//         } catch (err) {
//             console.error('Error during token validation:', err.message);

//             if (err.name === 'TokenExpiredError') {
//                 return res.status(401).send('Token has expired. Please log in again.');
//             }

//             return res.status(400).send('Invalid token.');
//         }
//     };
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const { Pool } = require('../config/dbConfig'); // Import db connection pool

// const authMiddleware = () => {
//     return async (req, res, next) => {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         // Log token for debugging
//         console.log('Received Token:', token);

//         if (!token) {
//             console.log('Access Denied: No token provided.');
//             return res.status(401).json({ error: 'Access Denied. No token provided.' });
//         }

//         try {
//             const secretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key';
//             console.log('Secret Key:', secretKey);  // Log secret key for debugging (Don't do this in production!)

//             // Verify the token
//             const decoded = jwt.verify(token, secretKey);
//             req.user = decoded;

//             console.log(`Token Validated for User ID: ${req.user.userId}, Role: ${req.user.role}`);

//             // Optional: Check if the user exists in the database
//             const pool = new Pool();
//             const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [req.user.userId]);

//             if (userResult.rows.length === 0) {
//                 console.log('User not found or deactivated.');
//                 return res.status(401).json({ error: 'User not found or deactivated.' });
//             }

//             next();  // Pass the control to the next middleware or route handler
//         } catch (err) {
//             console.error('Error during token validation:', err.message);

//             if (err.name === 'TokenExpiredError') {
//                 return res.status(401).json({ error: 'Token has expired. Please log in again.' });
//             }

//             return res.status(400).json({ error: 'Invalid token.', details: err.message });
//         }
//     };
// };

// module.exports = authMiddleware;
//----

// const jwt = require('jsonwebtoken');
// const { Pool } = require('../config/dbConfig'); // Import db connection pool

// const authMiddleware = () => {
//     return async (req, res, next) => {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         // Log token for debugging
//         console.log('Received Token:', token);

//         if (!token) {
//             console.log('Access Denied: No token provided.');
//             return res.status(401).json({ error: 'Access Denied. No token provided.' });
//         }

//         try {
//             const secretKey = process.env.JWT_SECRET_KEY || 'your_default_secret_key';
//             console.log('Secret Key:', secretKey);  // Log secret key for debugging (Don't do this in production!)

//             // Verify the token
//             const decoded = jwt.verify(token, secretKey);
//             req.user = decoded;

//             console.log(`Token Validated for User ID: ${req.user.userId}, Role: ${req.user.role}`);

//             // Optional: Check if the user exists in the database
//             const pool = new Pool();
//             const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [req.user.userId]);

//             if (userResult.rows.length === 0) {
//                 console.log('User not found or deactivated.');
//                 return res.status(401).json({ error: 'User not found or deactivated.' });
//             }

//             next();  // Pass the control to the next middleware or route handler
//         } catch (err) {
//             console.error('Error during token validation:', err.message);

//             if (err.name === 'TokenExpiredError') {
//                 return res.status(401).json({ error: 'Token has expired. Please log in again.' });
//             }

//             return res.status(400).json({ error: 'Invalid token.', details: err.message });
//         }
//     };
// };

// module.exports = authMiddleware;
//===========
// authMiddleware.js


const jwt = require('jsonwebtoken'); // Import jsonwebtoken once at the top
const pool = require('../config/dbConfig'); // Import the pre-configured pool

const authMiddleware = () => {
    return async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Log token for debugging
        console.log('Received Token:', token);

        if (!token) {
            console.log('Access Denied: No token provided.');
            return res.status(401).json({ error: 'Access Denied. No token provided.' });
        }

        try {
            const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Ensure this is the same key as in auth routes
            console.log('Secret Key:', secretKey);  // Log secret key for debugging

            // Verify the token
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;

            console.log(`Token Validated for User ID: ${req.user.userId}, Role: ${req.user.role}`);

            // Check if the user exists in the database using the imported pool
            const userResult = await pool.query('SELECT * FROM Users WHERE User_ID = $1', [req.user.userId]);

            if (userResult.rows.length === 0) {
                console.log('User not found or deactivated.');
                return res.status(401).json({ error: 'User not found or deactivated.' });
            }

            next();  // Pass the control to the next middleware or route handler
        } catch (err) {
            console.error('Error during token validation:', err.message);

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token has expired. Please log in again.' });
            }

            return res.status(400).json({ error: 'Invalid token.', details: err.message });
        }
    };
};

module.exports = authMiddleware;
