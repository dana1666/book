
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { sql, poolPromise } = require('../config/dbConfig');
// const router = express.Router();

// const secretKey = 'your_jwt_secret_key'; 

// // Register a new user
// router.post('/register', async (req, res) => {
//     const { firstName, lastName, email, password, role } = req.body;
//     try {
//         const pool = await poolPromise;
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         await pool.request()
//             .input('First_Name', sql.VarChar, firstName)
//             .input('Last_Name', sql.VarChar, lastName)
//             .input('Email', sql.VarChar, email)
//             .input('Password_Hash', sql.VarChar, hashedPassword)
//             .input('Role', sql.VarChar, role)
//             .query('INSERT INTO Users (First_Name, Last_Name, Email, Password_Hash, Role) VALUES (@First_Name, @Last_Name, @Email, @Password_Hash, @Role)');
        
//         res.status(201).send('User registered successfully');
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // User login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('Email', sql.VarChar, email)
//             .query('SELECT * FROM Users WHERE Email = @Email');

//         if (result.recordset.length === 0) {
//             return res.status(400).send('User not found');
//         }

//         const user = result.recordset[0];
//         const validPassword = await bcrypt.compare(password, user.Password_Hash);

//         if (!validPassword) {
//             return res.status(400).send('Invalid password');
//         }

//         // Generate a token and include the user's role in the payload
//         const token = jwt.sign({ userId: user.User_ID, role: user.Role }, secretKey, { expiresIn: '1h' });
        
//         // Send back the token, role, and userId
//         res.json({ token, role: user.Role, userId: user.User_ID });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // Route to retrieve user role based on token
// router.get('/getUserRole', async (req, res) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).send('Access Denied. No token provided.');
//     }

//     try {
//         const decoded = jwt.verify(token, secretKey);
//         const userId = decoded.userId;

//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('User_ID', sql.Int, userId)
//             .query('SELECT Role FROM Users WHERE User_ID = @User_ID');

//         if (result.recordset.length === 0) {
//             return res.status(404).send('User not found');
//         }

//         const role = result.recordset[0].Role;
//         res.json({ role });
//     } catch (err) {
//         res.status(400).send('Invalid token.');
//     }
// });

// module.exports = router;
///---------

// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { query } = require('../config/dbConfig'); // Use pg query function from dbConfig
// const router = express.Router();

// const secretKey = 'your_jwt_secret_key'; 

// // Register a new user
// router.post('/register', async (req, res) => {
//     const { firstName, lastName, email, password, role } = req.body;
//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert the new user into the Users table
//         await query(
//             'INSERT INTO Users (First_Name, Last_Name, Email, Password_Hash, Role) VALUES ($1, $2, $3, $4, $5)',
//             [firstName, lastName, email, hashedPassword, role]
//         );

//         res.status(201).send('User registered successfully');
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // User login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         // Query the Users table by email
//         const result = await query('SELECT * FROM Users WHERE Email = $1', [email]);

//         if (result.rows.length === 0) {
//             return res.status(400).send('User not found');
//         }

//         const user = result.rows[0]; // Access the user data from the result
//         const validPassword = await bcrypt.compare(password, user.password_hash);

//         if (!validPassword) {
//             return res.status(400).send('Invalid password');
//         }

//         // Generate a token and include the user's role in the payload
//         const token = jwt.sign({ userId: user.user_id, role: user.role }, secretKey, { expiresIn: '1h' });
        
//         // Send back the token, role, and userId
//         res.json({ token, role: user.role, userId: user.user_id });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // Route to retrieve user role based on token
// router.get('/getUserRole', async (req, res) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).send('Access Denied. No token provided.');
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, secretKey);
//         const userId = decoded.userId;

//         // Query the Users table by user ID
//         const result = await query('SELECT Role FROM Users WHERE User_ID = $1', [userId]);

//         if (result.rows.length === 0) {
//             return res.status(404).send('User not found');
//         }

//         const role = result.rows[0].role;
//         res.json({ role });
//     } catch (err) {
//         res.status(400).send('Invalid token.');
//     }
// });

// module.exports = router;

//============

// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/dbConfig');  // Import pool from dbConfig
// const router = express.Router();

// const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key';  // Use environment variable for the secret key

// // Register a new user
// router.post('/register', async (req, res) => {
//     const { firstName, lastName, email, password, role } = req.body;

//     // Check if all fields are provided
//     if (!firstName || !lastName || !email || !password || !role) {
//         return res.status(400).send('All fields are required');
//     }

//     try {
//         // Check if the user already exists
//         const userExists = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
//         if (userExists.rows.length > 0) {
//             return res.status(400).send('User with this email already exists');
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert the new user into the Users table
//         await pool.query(
//             'INSERT INTO Users (First_Name, Last_Name, Email, Password_Hash, Role) VALUES ($1, $2, $3, $4, $5)',
//             [firstName, lastName, email, hashedPassword, role]
//         );

//         res.status(201).send('User registered successfully');
//     } catch (err) {
//         console.error('Error during registration:', err.message);
//         res.status(500).send('Server error during registration');
//     }
// });

// // User login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     // Check if email and password are provided
//     if (!email || !password) {
//         return res.status(400).send('Email and password are required');
//     }

//     try {
//         // Query the Users table by email
//         const result = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);

//         if (result.rows.length === 0) {
//             return res.status(400).send('User not found');
//         }

//         const user = result.rows[0]; // Access the user data from the result
//         const validPassword = await bcrypt.compare(password, user.password_hash);

//         if (!validPassword) {
//             return res.status(400).send('Invalid password');
//         }

//         // Generate a token and include the user's role in the payload
//         const token = jwt.sign({ userId: user.user_id, role: user.role }, secretKey, { expiresIn: '1h' });
        
//         // Send back the token, role, and userId
//         res.json({ token, role: user.role, userId: user.user_id });
//     } catch (err) {
//         console.error('Error during login:', err.message);
//         res.status(500).send('Server error during login');
//     }
// });

// // Route to retrieve user role based on token
// router.get('/getUserRole', async (req, res) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).send('Access Denied. No token provided.');
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, secretKey);
//         const userId = decoded.userId;

//         // Query the Users table by user ID
//         const result = await pool.query('SELECT Role FROM Users WHERE User_ID = $1', [userId]);

//         if (result.rows.length === 0) {
//             return res.status(404).send('User not found');
//         }

//         const role = result.rows[0].role;
//         res.json({ role });
//     } catch (err) {
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401).send('Token has expired');
//         }
//         console.error('Error during token verification:', err.message);
//         res.status(400).send('Invalid token');
//     }
// });

// module.exports = router;

//000000

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/dbConfig');  // Import database connection pool
const router = express.Router();

// Use an environment variable for the secret key, fallback to a default value if not set
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key';  

// Register a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const userExists = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the Users table
        await pool.query(
            'INSERT INTO Users (First_Name, Last_Name, Email, Password_Hash, Role) VALUES ($1, $2, $3, $4, $5)',
            [firstName, lastName, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Query the Users table by email
        const result = await pool.query('SELECT * FROM Users WHERE Email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate a token and include the user's role in the payload
        const token = jwt.sign({ userId: user.user_id, role: user.role }, secretKey, { expiresIn: '1h' });
        
        // Send back the token, role, and userId
        res.json({ token, role: user.role, userId: user.user_id });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Route to retrieve user role based on the token
router.get('/getUserRole', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;

        // Query the Users table by user ID
        const result = await pool.query('SELECT Role FROM Users WHERE User_ID = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const role = result.rows[0].role;
        res.json({ role });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        console.error('Error during token verification:', err.message);
        res.status(400).json({ error: 'Invalid token' });
    }
});

module.exports = router;

