// const express = require('express');
// const { sql, poolPromise } = require('../config/dbConfig');
// const router = express.Router();

// // Route to add inventory data
// router.post('/add', async (req, res) => {
//     const { bookId, stockQuantity } = req.body;
//     try {
//         const pool = await poolPromise;
//         await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .input('Stock_Quantity', sql.Int, stockQuantity)
//             .query("INSERT INTO Inventory (Book_ID, Stock_Quantity) VALUES (@Book_ID, @Stock_Quantity)");

//         res.status(201).send('Inventory added successfully');
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });


// module.exports = router;
///--------

// const express = require('express');
// const { query } = require('../config/dbConfig');  // Import the pg query function
// const router = express.Router();

// // Route to add inventory data
// router.post('/add', async (req, res) => {
//     const { bookId, stockQuantity } = req.body;
    
//     try {
//         // Use pg query for database interaction
//         await query(
//             "INSERT INTO Inventory (Book_ID, Stock_Quantity) VALUES ($1, $2)",
//             [bookId, stockQuantity]
//         );

//         res.status(201).send('Inventory added successfully');
//     } catch (err) {
//         console.error('Error adding inventory:', err.message);
//         res.status(500).send(err.message);
//     }
// });

// module.exports = router;
//===========


const express = require('express');
const { query } = require('../config/dbConfig');  // Import the pg query function
const router = express.Router();

// Route to add inventory data
router.post('/add', async (req, res) => {
    const { bookId, stockQuantity } = req.body;

    // Input validation
    if (!bookId || !stockQuantity || stockQuantity <= 0) {
        return res.status(400).json({ error: 'Invalid book ID or stock quantity' });
    }
    
    try {
        // Check if inventory already exists for the given book
        const existingInventory = await query("SELECT * FROM Inventory WHERE Book_ID = $1", [bookId]);

        if (existingInventory.rows.length > 0) {
            return res.status(400).json({ error: 'Inventory for this book already exists' });
        }

        // Insert new inventory data
        await query(
            "INSERT INTO Inventory (Book_ID, Stock_Quantity) VALUES ($1, $2)",
            [bookId, stockQuantity]
        );

        res.status(201).send('Inventory added successfully');
    } catch (err) {
        console.error('Error adding inventory:', err.message);
        res.status(500).json({ error: 'Server error while adding inventory' });
    }
});

module.exports = router;
