

// const express = require('express');
// const { sql, poolPromise } = require('../config/dbConfig');
// const router = express.Router();

// // Route to get unseen messages for a specific writer
// router.get('/:writerId', async (req, res) => {
//     const writerId = parseInt(req.params.writerId, 10); 

//     if (isNaN(writerId)) {
//         return res.status(400).send('Invalid Writer ID.');
//     }

//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('Writer_ID', sql.Int, writerId)
//             .query(`
//                 SELECT m.Message_Text, b.Title AS Book_Title, m.Created_At, m.Is_Seen
//                 FROM Messages m
//                 JOIN Books b ON m.Book_ID = b.Book_ID
//                 WHERE m.Writer_ID = @Writer_ID AND m.Is_Seen = 0
//                 ORDER BY m.Created_At DESC
//             `);

//         // Mark these messages as seen after retrieving them
//         await pool.request()
//             .input('Writer_ID', sql.Int, writerId)
//             .query('UPDATE Messages SET Is_Seen = 1 WHERE Writer_ID = @Writer_ID AND Is_Seen = 0');

//         res.json(result.recordset);
//     } catch (err) {
//         console.error('Error retrieving messages:', err.message);
//         res.status(500).send(`Error retrieving messages: ${err.message}`);
//     }
// });

// module.exports = router;
///---------------------------

// const express = require('express');
// const { query } = require('../config/dbConfig');  // Import the pg query function
// const router = express.Router();

// // Route to get unseen messages for a specific writer
// router.get('/:writerId', async (req, res) => {
//     const writerId = parseInt(req.params.writerId, 10);

//     if (isNaN(writerId)) {
//         return res.status(400).send('Invalid Writer ID.');
//     }

//     try {
//         // Retrieve unseen messages for the writer
//         const result = await query(
//             `
//             SELECT m.Message_Text, b.Title AS Book_Title, m.Created_At, m.Is_Seen
//             FROM Messages m
//             JOIN Books b ON m.Book_ID = b.Book_ID
//             WHERE m.Writer_ID = $1 AND m.Is_Seen = 0
//             ORDER BY m.Created_At DESC
//             `,
//             [writerId]
//         );

//         // Mark these messages as seen
//         await query(
//             'UPDATE Messages SET Is_Seen = 1 WHERE Writer_ID = $1 AND Is_Seen = 0',
//             [writerId]
//         );

//         res.json(result.rows);  // Using `rows` instead of `recordset` in pg
//     } catch (err) {
//         console.error('Error retrieving messages:', err.message);
//         res.status(500).send(`Error retrieving messages: ${err.message}`);
//     }
// });

// module.exports = router;
//===========

// const express = require('express');
// const { query } = require('../config/dbConfig');  // Import the pg query function
// const router = express.Router();

// // Route to get unseen messages for a specific writer
// router.get('/:writerId', async (req, res) => {
//     const writerId = parseInt(req.params.writerId, 10);

//     if (isNaN(writerId)) {
//         return res.status(400).json({ error: 'Invalid Writer ID' });
//     }

//     try {
//         // Check if the writer exists
//         const writerExists = await query('SELECT * FROM Users WHERE User_ID = $1 AND Role = $2', [writerId, 'writer']);
//         if (writerExists.rows.length === 0) {
//             return res.status(404).json({ error: 'Writer not found' });
//         }

//         // Retrieve and update unseen messages for the writer in one query
//         const result = await query(
//             `
//             UPDATE Messages
//             SET Is_Seen = 1
//             FROM Books b
//             WHERE Messages.Writer_ID = $1 AND Messages.Book_ID = b.Book_ID AND Messages.Is_Seen = 0
//             RETURNING Messages.Message_Text, b.Title AS Book_Title, Messages.Created_At, Messages.Is_Seen
//             `,
//             [writerId]
//         );

//         res.json(result.rows);  // Return the unseen messages that were updated
//     } catch (err) {
//         console.error('Error retrieving messages:', err.message);
//         res.status(500).json({ error: `Error retrieving messages: ${err.message}` });
//     }
// });

// module.exports = router;

//==

// const express = require('express');
// const pool = require('../config/dbConfig');  // Import the pool directly from dbConfig
// const router = express.Router();

// // Route to get unseen messages for a specific writer
// router.get('/:writerId', async (req, res) => {
//     const writerId = parseInt(req.params.writerId, 10);

//     // Validate Writer ID
//     if (isNaN(writerId)) {
//         return res.status(400).json({ error: 'Invalid Writer ID' });
//     }

//     try {
//         // Check if the writer exists
//         const writerExists = await pool.query(
//             'SELECT * FROM Users WHERE User_ID = $1 AND Role = $2', 
//             [writerId, 'writer']
//         );
        
//         if (writerExists.rows.length === 0) {
//             return res.status(404).json({ error: 'Writer not found' });
//         }

//         // Retrieve and update unseen messages for the writer
//         const result = await pool.query(
//             `
//             UPDATE Messages
//             SET Is_Seen = true
//             FROM Books b
//             WHERE Messages.Writer_ID = $1 
//             AND Messages.Book_ID = b.Book_ID 
//             AND Messages.Is_Seen = false
//             RETURNING Messages.Message_Text, b.Title AS Book_Title, Messages.Created_At, Messages.Is_Seen
//             `,
//             [writerId]
//         );

//         // Return the unseen messages that were updated
//         res.json(result.rows);
//     } catch (err) {
//         console.error('Error retrieving messages:', err.message);
//         res.status(500).json({ error: `Error retrieving messages: ${err.message}` });
//     }
// });

// module.exports = router;
//777777

const express = require('express');
const pool = require('../config/dbConfig');  // Import the pool directly from dbConfig
const router = express.Router();

// Route to get unseen messages for a specific writer
router.get('/:writerId', async (req, res) => {
    const writerId = parseInt(req.params.writerId, 10);

    // Validate Writer ID
    if (isNaN(writerId)) {
        return res.status(400).json({ error: 'Invalid Writer ID' });
    }

    try {
        // Check if the writer exists
        const writerExists = await pool.query(
            'SELECT * FROM Users WHERE User_ID = $1 AND Role = $2', 
            [writerId, 'writer']
        );
        
        if (writerExists.rows.length === 0) {
            return res.status(404).json({ error: 'Writer not found' });
        }

        // Retrieve and update unseen messages for the writer
        const result = await pool.query(
            `
            UPDATE Messages
            SET Is_Seen = true
            FROM Books b
            WHERE Messages.Writer_ID = $1 
            AND Messages.Book_ID = b.Book_ID 
            AND Messages.Is_Seen = false
            RETURNING Messages.Message_Text, b.Title AS Book_Title, Messages.Created_At, Messages.Is_Seen
            `,
            [writerId]
        );

        // Return the unseen messages that were updated
        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving messages:', err.message);
        res.status(500).json({ error: `Error retrieving messages: ${err.message}` });
    }
});

module.exports = router;

