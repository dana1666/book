
// const { sql, poolPromise } = require('../config/dbConfig');

// // View pending books for approval
// const getPendingBooks = async (req, res) => {
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .query("SELECT * FROM Books WHERE Status = 'pending'");

//         res.json(result.recordset);
//     } catch (err) {
//         console.error('Error retrieving pending books:', err.message);
//         res.status(500).send(`Error retrieving pending books: ${err.message}`);
//     }
// };

// // Approve or reject a book
// const decideApproval = async (req, res) => {
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

//         // Determine the message text based on the status
//         const messageText = status === 'approved' 
//             ? `Your book "${bookResult.recordset[0].Title}" has been approved.` 
//             : `Your book "${bookResult.recordset[0].Title}" has been rejected.`;

//         // Insert message to the writer
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
// };

// module.exports = {
//     getPendingBooks,
//     decideApproval,
// };
//------
// const { query } = require('../config/dbConfig');

// // View pending books for approval
// const getPendingBooks = async (req, res) => {
//     try {
//         const result = await query("SELECT * FROM Books WHERE Status = 'pending'");
//         res.json(result.rows);  // Use .rows for PostgreSQL result set
//     } catch (err) {
//         console.error('Error retrieving pending books:', err.message);
//         res.status(500).send(`Error retrieving pending books: ${err.message}`);
//     }
// };

// // Approve or reject a book
// const decideApproval = async (req, res) => {
//     const { bookId, status } = req.body;

//     try {
//         // Check if the book exists and is pending
//         const bookQuery = "SELECT * FROM Books WHERE Book_ID = $1 AND Status = 'pending';";
//         const bookResult = await query(bookQuery, [bookId]);

//         if (bookResult.rows.length === 0) {
//             return res.status(404).send('Book not found or already approved/rejected');
//         }

//         const writerId = bookResult.rows[0].writer_id;

//         // Update the status of the book
//         const updateQuery = "UPDATE Books SET Status = $1 WHERE Book_ID = $2;";
//         await query(updateQuery, [status, bookId]);

//         // Determine the message text based on the status
//         const messageText = status === 'approved' 
//             ? `Your book "${bookResult.rows[0].title}" has been approved.` 
//             : `Your book "${bookResult.rows[0].title}" has been rejected.`;

//         // Insert message to the writer
//         await query(
//             "INSERT INTO Messages (Writer_ID, Book_ID, Message_Text) VALUES ($1, $2, $3)",
//             [writerId, bookId, messageText]
//         );

//         res.send(`Book status updated to ${status}`);
//     } catch (err) {
//         console.error('Error during book status update:', err.message);
//         res.status(500).send(`Error during book status update: ${err.message}`);
//     }
// };

// module.exports = {
//     getPendingBooks,
//     decideApproval,
// };
//===============

// const { Pool } = require('../config/dbConfig');

// // Create a new pool instance
// const pool = new Pool();

// // View pending books for approval
// const getPendingBooks = async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM Books WHERE Status = 'pending'");
//         res.json(result.rows);  // Use .rows for PostgreSQL result set
//     } catch (err) {
//         console.error('Error retrieving pending books:', err.message);
//         res.status(500).send(`Error retrieving pending books: ${err.message}`);
//     }
// };

// // Approve or reject a book
// const decideApproval = async (req, res) => {
//     const { bookId, status } = req.body;

//     // Validate input
//     if (!bookId || !['approved', 'rejected'].includes(status)) {
//         return res.status(400).send('Invalid input. Provide a valid book ID and status.');
//     }

//     const client = await pool.connect();  // Start transaction

//     try {
//         await client.query('BEGIN');

//         // Check if the book exists and is pending
//         const bookQuery = "SELECT * FROM Books WHERE Book_ID = $1 AND Status = 'pending';";
//         const bookResult = await client.query(bookQuery, [bookId]);

//         if (bookResult.rows.length === 0) {
//             await client.query('ROLLBACK');
//             return res.status(404).send('Book not found or already approved/rejected');
//         }

//         const writerId = bookResult.rows[0].writer_id;
//         const bookTitle = bookResult.rows[0].title;

//         // Update the status of the book
//         const updateQuery = "UPDATE Books SET Status = $1 WHERE Book_ID = $2;";
//         await client.query(updateQuery, [status, bookId]);

//         // Determine the message text based on the status
//         const messageText = status === 'approved' 
//             ? `Your book "${bookTitle}" has been approved.` 
//             : `Your book "${bookTitle}" has been rejected.`;

//         // Insert message to the writer
//         await client.query(
//             "INSERT INTO Messages (Writer_ID, Book_ID, Message_Text) VALUES ($1, $2, $3)",
//             [writerId, bookId, messageText]
//         );

//         await client.query('COMMIT');  // Commit transaction

//         res.send(`Book status updated to ${status}`);
//     } catch (err) {
//         await client.query('ROLLBACK');  // Rollback transaction on error
//         console.error('Error during book status update:', err.message);
//         res.status(500).send(`Error during book status update: ${err.message}`);
//     } finally {
//         client.release();  // Release the client back to the pool
//     }
// };

// module.exports = {
//     getPendingBooks,
//     decideApproval,
// };

//77777

const { Pool } = require('../config/dbConfig');

// Create a new pool instance
const pool = new Pool();

// View pending books for approval
const getPendingBooks = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Books WHERE Status = 'pending'");
        res.json(result.rows);  // Use .rows for PostgreSQL result set
    } catch (err) {
        console.error('Error retrieving pending books:', err.message);
        res.status(500).send(`Error retrieving pending books: ${err.message}`);
    }
};

// Approve or reject a book
const decideApproval = async (req, res) => {
    const { bookId, status } = req.body;

    // Validate input
    if (!bookId || !['approved', 'rejected'].includes(status)) {
        return res.status(400).send('Invalid input. Provide a valid book ID and status.');
    }

    const client = await pool.connect();  // Start transaction

    try {
        await client.query('BEGIN');

        // Check if the book exists and is pending
        const bookQuery = "SELECT * FROM Books WHERE Book_ID = $1 AND Status = 'pending';";
        const bookResult = await client.query(bookQuery, [bookId]);

        if (bookResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).send('Book not found or already approved/rejected');
        }

        const writerId = bookResult.rows[0].writer_id;
        const bookTitle = bookResult.rows[0].title;

        // Update the status of the book
        const updateQuery = "UPDATE Books SET Status = $1 WHERE Book_ID = $2;";
        await client.query(updateQuery, [status, bookId]);

        // Determine the message text based on the status
        const messageText = status === 'approved' 
            ? `Your book "${bookTitle}" has been approved.` 
            : `Your book "${bookTitle}" has been rejected.`;

        // Insert message to the writer
        await client.query(
            "INSERT INTO Messages (Writer_ID, Book_ID, Message_Text) VALUES ($1, $2, $3)",
            [writerId, bookId, messageText]
        );

        await client.query('COMMIT');  // Commit transaction

        res.send(`Book status updated to ${status}`);
    } catch (err) {
        await client.query('ROLLBACK');  // Rollback transaction on error
        console.error('Error during book status update:', err.message);
        res.status(500).send(`Error during book status update: ${err.message}`);
    } finally {
        client.release();  // Release the client back to the pool
    }
};

module.exports = {
    getPendingBooks,
    decideApproval,
};

