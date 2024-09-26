
// const express = require('express');
// const { sql, poolPromise } = require('../config/dbConfig');
// const router = express.Router();

// // Route to get all pending books for approval
// router.get('/pending', async (req, res) => {
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .query("SELECT * FROM Books WHERE Status = 'pending'");
//         res.json(result.recordset);
//     } catch (err) {
//         console.error('Error retrieving pending books:', err.message);
//         res.status(500).send(`Error retrieving pending books: ${err.message}`);
//     }
// });

// // Approve or reject a book
// router.post('/decide', async (req, res) => {
//     const { bookId, status } = req.body;

//     try {
//         const pool = await poolPromise;

//         // Check if the book exists and is pending
//         const bookQuery = `SELECT * FROM Books WHERE Book_ID = @Book_ID AND Status = 'pending';`;
//         const bookResult = await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .query(bookQuery);

//         if (bookResult.recordset.length === 0) {
//             return res.status(404).send('Book not found or already approved/rejected');
//         }

//         const writerId = bookResult.recordset[0].Writer_ID;

//         // Update the status of the book
//         const updateQuery = `UPDATE Books SET Status = @Status WHERE Book_ID = @Book_ID;`;
//         await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .input('Status', sql.VarChar, status)
//             .query(updateQuery);

//         // Insert message to the writer
//         const messageText = status === 'approved' ? 'Your book has been approved.' : 'Your book has been rejected.';
//         await pool.request()
//             .input('Writer_ID', sql.Int, writerId)
//             .input('Book_ID', sql.Int, bookId)
//             .input('Message_Text', sql.VarChar, messageText)
//             .query(`INSERT INTO Messages (Writer_ID, Book_ID, Message_Text) VALUES (@Writer_ID, @Book_ID, @Message_Text)`);

//         res.send(`Book status updated to ${status}`);
//     } catch (err) {
//         console.error('Error during book status update:', err.message);
//         res.status(500).send(`Error during book status update: ${err.message}`);
//     }
// });

// module.exports = router;
//-----------------------------

// const express = require('express');
// const { query } = require('../config/dbConfig'); // Use pg query function from dbConfig
// const router = express.Router();

// // Route to get all pending books for approval
// router.get('/pending', async (req, res) => {
//     try {
//         // Query to get all pending books
//         const result = await query("SELECT * FROM Books WHERE Status = 'pending'");
//         res.json(result.rows); // Using result.rows for pg
//     } catch (err) {
//         console.error('Error retrieving pending books:', err.message);
//         res.status(500).send(`Error retrieving pending books: ${err.message}`);
//     }
// });

// // Approve or reject a book
// router.post('/decide', async (req, res) => {
//     const { bookId, status } = req.body;

//     try {
//         // Check if the book exists and is pending
//         const bookQuery = `SELECT * FROM Books WHERE Book_ID = $1 AND Status = 'pending';`;
//         const bookResult = await query(bookQuery, [bookId]);

//         if (bookResult.rows.length === 0) {
//             return res.status(404).send('Book not found or already approved/rejected');
//         }

//         const writerId = bookResult.rows[0].writer_id;

//         // Update the status of the book
//         const updateQuery = `UPDATE Books SET Status = $1 WHERE Book_ID = $2;`;
//         await query(updateQuery, [status, bookId]);

//         // Insert message to the writer
//         const messageText = status === 'approved' ? 'Your book has been approved.' : 'Your book has been rejected.';
//         await query(
//             `INSERT INTO Messages (Writer_ID, Book_ID, Message_Text) VALUES ($1, $2, $3)`,
//             [writerId, bookId, messageText]
//         );

//         res.send(`Book status updated to ${status}`);
//     } catch (err) {
//         console.error('Error during book status update:', err.message);
//         res.status(500).send(`Error during book status update: ${err.message}`);
//     }
// });

// module.exports = router;
//==========

const express = require('express');
const pool = require('../config/dbConfig'); // Import pool from dbConfig
const router = express.Router();

// Route to get all pending books for approval
router.get('/pending', async (req, res) => {
    try {
        // Query to get all pending books
        const result = await pool.query("SELECT * FROM Books WHERE Status = 'pending'");
        res.json(result.rows); // Send back all pending books
    } catch (err) {
        console.error('Error retrieving pending books:', err.message);
        res.status(500).send(`Error retrieving pending books: ${err.message}`);
    }
});

// Approve or reject a book
router.post('/decide', async (req, res) => {
    const { bookId, status } = req.body;

    // Validate the status
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).send('Invalid status. Must be either "approved" or "rejected".');
    }

    try {
        // Check if the book exists and is pending
        const bookQuery = `SELECT * FROM Books WHERE Book_ID = $1 AND Status = 'pending';`;
        const bookResult = await pool.query(bookQuery, [bookId]);

        if (bookResult.rows.length === 0) {
            return res.status(404).send('Book not found or already approved/rejected');
        }

        const writerId = bookResult.rows[0].writer_id;

        // Update the status of the book
        const updateQuery = `UPDATE Books SET Status = $1 WHERE Book_ID = $2;`;
        await pool.query(updateQuery, [status, bookId]);

        // Insert message to the writer
        const messageText = status === 'approved' ? 'Your book has been approved.' : 'Your book has been rejected.';
        await pool.query(
            `INSERT INTO Messages (Writer_ID, Book_ID, Message_Text) VALUES ($1, $2, $3)`,
            [writerId, bookId, messageText]
        );

        res.send(`Book status updated to ${status}`);
    } catch (err) {
        console.error('Error during book status update:', err.message);
        res.status(500).send(`Error during book status update: ${err.message}`);
    }
});

module.exports = router;
