
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// const { sql, poolPromise } = require('./config/dbConfig');

// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.IO with CORS configuration
// const io = new Server(server, {
//     cors: {
//         origin: "*", 
//         methods: ["GET", "POST", "PUT", "DELETE"],  
//     }
// });

// // Middleware
// app.use(cors()); 
// app.use(bodyParser.json());  
// app.use(bodyParser.urlencoded({ extended: true })); 
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

// // Import routes 
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes')(io);
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const approvalRoutes = require('./routes/approvalRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const messagesRoutes = require('./routes/messagesRoutes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes); 
// app.use('/api/cart', cartRoutes);  
// app.use('/api/orders', orderRoutes);  
// app.use('/api/approvals', approvalRoutes); 
// app.use('/api/inventory', inventoryRoutes);  
// app.use('/api/messages', messagesRoutes);  

// // WebSocket connection and event handling
// io.on('connection', (socket) => {
//     console.log('A client connected:', socket.id);

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });

    
// });

// // Error handling middleware for catching errors in routes and sending proper responses
// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(500).send('Something went wrong!');  
// });

// // Serve the front-end
// app.use(express.static(path.join(__dirname, 'public'))); 

// // Start the server
// const PORT = process.env.PORT || 3084; 
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
/////--------------------------------------------------------------------
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// const { sql, poolPromise } = require('./config/dbConfig');

// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.IO with CORS configuration
// const io = new Server(server, {
//     cors: {
//         origin: "*", 
//         methods: ["GET", "POST", "PUT", "DELETE"],  
//     }
// });

// // Middleware
// app.use(cors()); 
// app.use(bodyParser.json());  
// app.use(bodyParser.urlencoded({ extended: true })); 

// // Serve the frontend from the "Frontend" folder
// app.use(express.static(path.join(__dirname, 'Frontend')));

// // Import routes 
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes')(io);
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const approvalRoutes = require('./routes/approvalRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const messagesRoutes = require('./routes/messagesRoutes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes); 
// app.use('/api/cart', cartRoutes);  
// app.use('/api/orders', orderRoutes);  
// app.use('/api/approvals', approvalRoutes); 
// app.use('/api/inventory', inventoryRoutes);  
// app.use('/api/messages', messagesRoutes);  

// // WebSocket connection and event handling
// io.on('connection', (socket) => {
//     console.log('A client connected:', socket.id);

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// // Error handling middleware for catching errors in routes and sending proper responses
// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(500).send('Something went wrong!');  
// });

// // Start the server
// const PORT = process.env.PORT || 3080; 
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
//--------------

// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// const pool = require('./config/dbConfig');  // Update to require pool directly

// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.IO with CORS configuration
// const io = new Server(server, {
//     cors: {
//         origin: "*", 
//         methods: ["GET", "POST", "PUT", "DELETE"],  
//     }
// });

// // Middleware
// app.use(cors()); 
// app.use(express.json());  // Replaces bodyParser.json()
// app.use(express.urlencoded({ extended: true }));  // Replaces bodyParser.urlencoded()
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

// // Import routes 
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes')(io);  // Passing Socket.IO instance
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const approvalRoutes = require('./routes/approvalRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const messagesRoutes = require('./routes/messagesRoutes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes); 
// app.use('/api/cart', cartRoutes);  
// app.use('/api/orders', orderRoutes);  
// app.use('/api/approvals', approvalRoutes); 
// app.use('/api/inventory', inventoryRoutes);  
// app.use('/api/messages', messagesRoutes);  

// // WebSocket connection and event handling
// io.on('connection', (socket) => {
//     console.log('A client connected:', socket.id);

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// // Error handling middleware for catching errors in routes and sending proper responses
// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(500).send('Something went wrong!');  
// });

// // Serve the front-end
// app.use(express.static(path.join(__dirname, 'public'))); 

// // Start the server
// const PORT = process.env.PORT || 3089;

// // Check database connection and start server
// pool
//     .connect()
//     .then(() => {
//         console.log('Connected to the database');
//         server.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error('Failed to connect to the database:', err);
//     });

//===============

// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// const pool = require('./config/dbConfig');  // Database connection pool

// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.IO with CORS configuration
// const io = new Server(server, {
//     cors: {
//         origin: "*", 
//         methods: ["GET", "POST", "PUT", "DELETE"],  
//     }
// });

// // Middleware
// app.use(cors()); 
// app.use(express.json());  // Parse JSON requests
// app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded requests
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve static files from uploads

// // Import routes 
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes')(io);  // Pass Socket.IO instance
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const approvalRoutes = require('./routes/approvalRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const messagesRoutes = require('./routes/messagesRoutes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes); 
// app.use('/api/cart', cartRoutes);  
// app.use('/api/orders', orderRoutes);  
// app.use('/api/approvals', approvalRoutes); 
// app.use('/api/inventory', inventoryRoutes);  
// app.use('/api/messages', messagesRoutes);  

// // WebSocket connection and event handling
// io.on('connection', (socket) => {
//     console.log('A client connected:', socket.id);

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// // Error handling middleware for catching errors in routes and sending proper responses
// app.use((err, req, res, next) => {
//     console.error(err.stack); 
//     res.status(500).send('Something went wrong!');  
// });

// // Serve the front-end
// app.use(express.static(path.join(__dirname, 'public'))); 

// // Start the server
// const PORT = process.env.PORT || 3096;

// // Test database connection before starting the server
// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error('Failed to connect to the database:', err);
//         process.exit(1);  // Exit the process with a failure code
//     } else {
//         console.log('Connected to the database:', res.rows[0].now);
//         server.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     }
// });

// module.exports = app;
//=========

// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// const pool = require('./config/dbConfig');  // Database connection pool

// const app = express();
// const server = http.createServer(app);

// // CORS options
// const corsOptions = {
//     origin: '*',  // Allows requests from any origin during development. Change this in production!
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };

// // Initialize Socket.IO with CORS configuration
// const io = new Server(server, {
//     cors: corsOptions
// });

// // Apply middleware
// app.use(cors(corsOptions));  // CORS middleware
// app.use(express.json());  // Parse JSON requests
// app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded requests
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve static files from 'uploads'

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes')(io);  // Pass Socket.IO instance
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const approvalRoutes = require('./routes/approvalRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const messagesRoutes = require('./routes/messagesRoutes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/approvals', approvalRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/messages', messagesRoutes);

// // Handle Socket.IO connections
// io.on('connection', (socket) => {
//     console.log('A client connected:', socket.id);

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// // Error handling middleware for catching errors in routes and sending proper responses
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// // Serve the front-end static files (if needed for deployment)
// app.use(express.static(path.join(__dirname, 'public')));

// // Start the server on the specified port
// const PORT = process.env.PORT || 4011;

// // Test database connection before starting the server
// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error('Failed to connect to the database:', err);
//         process.exit(1);  // Exit the process with a failure code
//     } else {
//         console.log('Connected to the database:', res.rows[0].now);
//         server.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     }
// });

// module.exports = app;
//=============

// const dotenv= require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// const pool = require('./config/dbConfig');  // Database connection pool

// const app = express();
// const server = http.createServer(app);

// // CORS options
// const corsOptions = {
//     origin: '*',  // Allows requests from any origin during development. Change this in production!
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
// };

// // Initialize Socket.IO with CORS configuration
// const io = new Server(server, {
//     cors: corsOptions
// });

// // Apply middleware
// app.use(cors(corsOptions));  // CORS middleware
// app.use(express.json());  // Parse JSON requests
// app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded requests
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve static files from 'uploads'

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes')(io);  // Pass Socket.IO instance
// const cartRoutes = require('./routes/cartRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const approvalRoutes = require('./routes/approvalRoutes');
// const inventoryRoutes = require('./routes/inventoryRoutes');
// const messagesRoutes = require('./routes/messagesRoutes');

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/approvals', approvalRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/messages', messagesRoutes);

// // Handle Socket.IO connections
// io.on('connection', (socket) => {
//     console.log('A client connected:', socket.id);

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

// // Error handling middleware for catching errors in routes and sending proper responses
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// // Serve the front-end static files (if needed for deployment)
// app.use(express.static(path.join(__dirname, 'public')));

// // Start the server on the specified port
// const PORT = process.env.PORT || 4013;

// // Test database connection before starting the server
// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error('Failed to connect to the database:', err);
//         process.exit(1);  // Exit the process with a failure code
//     } else {
//         console.log('Connected to the database:', res.rows[0].now);
//         server.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     }
// });

// module.exports = app;
//==========

const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const pool = require('./config/dbConfig');  // Database connection pool

const app = express();
const server = http.createServer(app);

// CORS options
const corsOptions = {
    origin: '*',  // Allows requests from any origin during development. Change this in production!
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
    cors: corsOptions
});

// Apply middleware
app.use(cors(corsOptions));  // CORS middleware
app.use(express.json());  // Parse JSON requests
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serve static files from 'uploads'

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes')(io);  // Pass Socket.IO instance
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const messagesRoutes = require('./routes/messagesRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/messages', messagesRoutes);

// Serve the front-end static files (if needed for deployment)
app.use(express.static(path.join(__dirname, 'public')));

// Provide API URL to frontend
app.get('/config', (req, res) => {
    res.json({
        apiUrl: process.env.API_URL || 'http://localhost:4052/api'
    });
});
// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Error handling middleware for catching errors in routes and sending proper responses
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server on the specified port
const PORT = process.env.PORT || 4052;

// Test database connection before starting the server
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1);  // Exit the process with a failure code
    } else {
        console.log('Connected to the database:', res.rows[0].now);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});

module.exports = app;
