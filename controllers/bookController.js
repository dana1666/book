
// const { sql, poolPromise } = require('../config/dbConfig');

// // Add a new book (Writer role)
// const addBook = async (req, res, io) => {
//     const { title, description, writerId, price, stockQuantity } = req.body;
//     const imagePath = req.file ? req.file.path : null;  // Get the uploaded image path

//     // Add validation to ensure title and other fields are not null or empty
//     if (!title || !description || !price || !stockQuantity) {
//         return res.status(400).send('All fields (title, description, price, stockQuantity) are required.');
//     }

//     try {
//         const pool = await poolPromise;
//         const bookResult = await pool.request()
//             .input('Title', sql.VarChar, title)
//             .input('Description', sql.Text, description)
//             .input('Writer_ID', sql.Int, writerId)
//             .input('Price', sql.Decimal(10, 2), price)
//             .input('Image_Path', sql.VarChar, imagePath)
//             .query('INSERT INTO Books (Title, Description, Writer_ID, Price, Status, Image_Path) OUTPUT INSERTED.Book_ID VALUES (@Title, @Description, @Writer_ID, @Price, \'pending\', @Image_Path)');

//         const bookId = bookResult.recordset[0].Book_ID;

//         // Add stock quantity to the Inventory table
//         await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .input('Stock_Quantity', sql.Int, stockQuantity)
//             .query('INSERT INTO Inventory (Book_ID, Stock_Quantity) VALUES (@Book_ID, @Stock_Quantity)');

//         // Emit a notification to approvers with the book title
//         io.emit('newBookNotification', { title });

//         res.status(201).send('Book submitted for approval');
//     } catch (err) {
//         res.status(500).send(`Error during book creation: ${err.message}`);
//     }
// };

// // Get all approved books (Buyers)
// const getApprovedBooks = async (req, res) => {
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .query("SELECT * FROM Books WHERE Status = 'approved'");

//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// // Get all books by a specific writer
// const getBooksByWriter = async (req, res) => {
//     const { writerId } = req.params;

//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('Writer_ID', sql.Int, writerId)
//             .query("SELECT Book_ID, Title, Status, Image_Path FROM Books WHERE Writer_ID = @Writer_ID");

//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).send(`Error retrieving books: ${err.message}`);
//     }
// };

// // Get a single book by ID including stock quantity
// const getBookById = async (req, res) => {
//     const { bookId } = req.params;

//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .query(`
//                 SELECT b.Book_ID, b.Title, b.Description, b.Price, i.Stock_Quantity, b.Image_Path 
//                 FROM Books b
//                 JOIN Inventory i ON b.Book_ID = i.Book_ID
//                 WHERE b.Book_ID = @Book_ID
//             `);

//         if (result.recordset.length === 0) {
//             return res.status(404).send('Book not found');
//         }

//         res.json(result.recordset[0]);
//     } catch (err) {
//         res.status(500).send(`Error retrieving book: ${err.message}`);
//     }
// };


// const updateBook = async (req, res) => {
//     const { bookId } = req.params;
//     const { title, description, price, stockQuantity } = req.body;

//     try {
//         const pool = await poolPromise;

//         // Update book details
//         await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .input('Title', sql.VarChar, title)
//             .input('Description', sql.Text, description)
//             .input('Price', sql.Decimal(10, 2), price)
//             .query('UPDATE Books SET Title = @Title, Description = @Description, Price = @Price WHERE Book_ID = @Book_ID');

//         // Update inventory quantity if stock quantity is provided
//         if (stockQuantity) {
//             await pool.request()
//                 .input('Book_ID', sql.Int, bookId)
//                 .input('Stock_Quantity', sql.Int, stockQuantity)
//                 .query('UPDATE Inventory SET Stock_Quantity = @Stock_Quantity WHERE Book_ID = @Book_ID');
//         }

//         res.status(200).send('Book updated successfully');
//     } catch (err) {
//         res.status(500).send(`Error updating book: ${err.message}`);
//     }
// };

// module.exports = {
//     addBook,
//     getApprovedBooks,
//     getBooksByWriter,
//     getBookById,
//     updateBook
// };
//---------

// const { query } = require('../config/dbConfig');

// // Add a new book (Writer role)
// const addBook = async (req, res, io) => {
//     const { title, description, writerId, price, stockQuantity } = req.body;
//     const imagePath = req.file ? req.file.path : null;

//     if (!title || !description || !price || !stockQuantity) {
//         return res.status(400).send('All fields (title, description, price, stockQuantity) are required.');
//     }

//     try {
//         const bookResult = await query(
//             'INSERT INTO Books (Title, Description, Writer_ID, Price, Status, Image_Path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING Book_ID',
//             [title, description, writerId, price, 'pending', imagePath]
//         );
//         const bookId = bookResult.rows[0].book_id;

//         // Add stock quantity to the Inventory table
//         await query('INSERT INTO Inventory (Book_ID, Stock_Quantity) VALUES ($1, $2)', [bookId, stockQuantity]);

//         // Emit a notification to approvers with the book title
//         io.emit('newBookNotification', { title });

//         res.status(201).send('Book submitted for approval');
//     } catch (err) {
//         res.status(500).send(`Error during book creation: ${err.message}`);
//     }
// };

// // Get all approved books (Buyers)
// const getApprovedBooks = async (req, res) => {
//     try {
//         const result = await query("SELECT * FROM Books WHERE Status = 'approved'");
//         res.json(result.rows);  // Use .rows for PostgreSQL result set
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// // Get all books by a specific writer
// const getBooksByWriter = async (req, res) => {
//     const { writerId } = req.params;

//     try {
//         const result = await query(
//             "SELECT Book_ID, Title, Status, Image_Path FROM Books WHERE Writer_ID = $1",
//             [writerId]
//         );
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).send(`Error retrieving books: ${err.message}`);
//     }
// };

// // Get a single book by ID including stock quantity
// const getBookById = async (req, res) => {
//     const { bookId } = req.params;

//     try {
//         const result = await query(
//             `SELECT b.Book_ID, b.Title, b.Description, b.Price, i.Stock_Quantity, b.Image_Path 
//             FROM Books b
//             JOIN Inventory i ON b.Book_ID = i.Book_ID
//             WHERE b.Book_ID = $1`,
//             [bookId]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).send('Book not found');
//         }

//         res.json(result.rows[0]);
//     } catch (err) {
//         res.status(500).send(`Error retrieving book: ${err.message}`);
//     }
// };

// // Update a book's details (for Writers)
// const updateBook = async (req, res) => {
//     const { bookId } = req.params;
//     const { title, description, price, stockQuantity } = req.body;

//     try {
//         // Update book details
//         await query(
//             'UPDATE Books SET Title = $1, Description = $2, Price = $3 WHERE Book_ID = $4',
//             [title, description, price, bookId]
//         );

//         // Update inventory quantity if stock quantity is provided
//         if (stockQuantity) {
//             await query('UPDATE Inventory SET Stock_Quantity = $1 WHERE Book_ID = $2', [stockQuantity, bookId]);
//         }

//         res.status(200).send('Book updated successfully');
//     } catch (err) {
//         res.status(500).send(`Error updating book: ${err.message}`);
//     }
// };

// module.exports = {
//     addBook,
//     getApprovedBooks,
//     getBooksByWriter,
//     getBookById,
//     updateBook,
// };
//===============

// const pool = require('../config/dbConfig');  // Import your db pool

// // Add a new book (Writer role)
// const addBook = async (req, res, io) => {
//     const { title, description, writerId, price, stockQuantity } = req.body;
//     const imagePath = req.file ? req.file.path : null;

//     if (!title || !description || !price || !stockQuantity) {
//         return res.status(400).send('All fields (title, description, price, stockQuantity) are required.');
//     }

//     const client = await pool.connect();  // Connect to the database

//     try {
//         await client.query('BEGIN');  // Start a transaction

//         // Insert the book into the Books table
//         const bookResult = await client.query(
//             `INSERT INTO Books (Title, Description, Writer_ID, Price, Status, Image_Path)
//              VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING Book_ID`,
//             [title, description, writerId, price, imagePath]
//         );

//         const bookId = bookResult.rows[0].book_id;

//         // Insert the stock quantity into the Inventory table
//         await client.query(
//             'INSERT INTO Inventory (Book_ID, Stock_Quantity) VALUES ($1, $2)',
//             [bookId, stockQuantity]
//         );

//         await client.query('COMMIT');  // Commit the transaction

//         // Emit a notification to approvers
//         io.emit('newBookNotification', { title });

//         res.status(201).send('Book submitted for approval');
//     } catch (err) {
//         await client.query('ROLLBACK');  // Rollback the transaction on error
//         res.status(500).send(`Error during book creation: ${err.message}`);
//     } finally {
//         client.release();  // Release the client back to the pool
//     }
// };

// // Get all approved books (Buyers)
// const getApprovedBooks = async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM Books WHERE Status = 'approved'");
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).send(`Error fetching approved books: ${err.message}`);
//     }
// };

// // Get all books by a specific writer
// const getBooksByWriter = async (req, res) => {
//     const { writerId } = req.params;

//     try {
//         const result = await pool.query(
//             'SELECT Book_ID, Title, Status, Image_Path FROM Books WHERE Writer_ID = $1',
//             [writerId]
//         );
//         res.json(result.rows);
//     } catch (err) {
//         res.status(500).send(`Error fetching books for writer: ${err.message}`);
//     }
// };

// // Get a single book by ID, including stock quantity
// const getBookById = async (req, res) => {
//     const { bookId } = req.params;

//     try {
//         const result = await pool.query(
//             `SELECT b.Book_ID, b.Title, b.Description, b.Price, i.Stock_Quantity, b.Image_Path 
//              FROM Books b
//              JOIN Inventory i ON b.Book_ID = i.Book_ID
//              WHERE b.Book_ID = $1`,
//             [bookId]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).send('Book not found');
//         }

//         res.json(result.rows[0]);
//     } catch (err) {
//         res.status(500).send(`Error fetching book details: ${err.message}`);
//     }
// };

// // Update a book's details (for Writers)
// const updateBook = async (req, res) => {
//     const { bookId } = req.params;
//     const { title, description, price, stockQuantity } = req.body;

//     const client = await pool.connect();

//     try {
//         await client.query('BEGIN');  // Start transaction

//         // Update book details
//         await client.query(
//             'UPDATE Books SET Title = $1, Description = $2, Price = $3 WHERE Book_ID = $4',
//             [title, description, price, bookId]
//         );

//         // Update inventory quantity if provided
//         if (stockQuantity !== undefined) {
//             await client.query(
//                 'UPDATE Inventory SET Stock_Quantity = $1 WHERE Book_ID = $2',
//                 [stockQuantity, bookId]
//             );
//         }

//         await client.query('COMMIT');  // Commit the transaction
//         res.status(200).send('Book updated successfully');
//     } catch (err) {
//         await client.query('ROLLBACK');  // Rollback transaction on error
//         res.status(500).send(`Error updating book: ${err.message}`);
//     } finally {
//         client.release();  // Release the client back to the pool
//     }
// };

// module.exports = {
//     addBook,
//     getApprovedBooks,
//     getBooksByWriter,
//     getBookById,
//     updateBook,
// };
//====

const pool = require('../config/dbConfig');  // Import your db pool

// Add a new book (Writer role)
const addBook = async (req, res, io) => {
    const { title, description, writerId, price, stockQuantity } = req.body;
    const imagePath = req.file ? req.file.path : null;

    // Validate input
    if (!title || !description || !price || !stockQuantity || !writerId) {
        return res.status(400).send('All fields (title, description, price, stockQuantity, writerId) are required.');
    }

    const client = await pool.connect();  // Connect to the database

    try {
        await client.query('BEGIN');  // Start a transaction

        // Insert the book into the Books table
        const bookResult = await client.query(
            `INSERT INTO Books (Title, Description, Writer_ID, Price, Status, Image_Path) 
             VALUES ($1, $2, $3, $4, 'pending', $5) 
             RETURNING Book_ID`,
            [title, description, writerId, price, imagePath]
        );

        const bookId = bookResult.rows[0].book_id;

        // Insert the stock quantity into the Inventory table
        await client.query(
            'INSERT INTO Inventory (Book_ID, Stock_Quantity) VALUES ($1, $2)',
            [bookId, stockQuantity]
        );

        await client.query('COMMIT');  // Commit the transaction

        // Emit a notification to approvers
        io.emit('newBookNotification', { title });

        return res.status(201).send('Book submitted for approval');
    } catch (err) {
        await client.query('ROLLBACK');  // Rollback the transaction on error
        return res.status(500).send(`Error during book creation: ${err.message}`);
    } finally {
        client.release();  // Release the client back to the pool
    }
};

// Get all approved books (Buyers)
const getApprovedBooks = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Books WHERE Status = 'approved'");
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).send(`Error fetching approved books: ${err.message}`);
    }
};

// Get all books by a specific writer
const getBooksByWriter = async (req, res) => {
    const { writerId } = req.params;

    try {
        const result = await pool.query(
            'SELECT Book_ID, Title, Status, Image_Path FROM Books WHERE Writer_ID = $1',
            [writerId]
        );
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).send(`Error fetching books for writer: ${err.message}`);
    }
};

// Get a single book by ID, including stock quantity
const getBookById = async (req, res) => {
    const { bookId } = req.params;

    try {
        const result = await pool.query(
            `SELECT b.Book_ID, b.Title, b.Description, b.Price, i.Stock_Quantity, b.Image_Path 
             FROM Books b
             JOIN Inventory i ON b.Book_ID = i.Book_ID
             WHERE b.Book_ID = $1`,
            [bookId]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Book not found');
        }

        return res.json(result.rows[0]);
    } catch (err) {
        return res.status(500).send(`Error fetching book details: ${err.message}`);
    }
};

// Update a book's details (for Writers)
const updateBook = async (req, res) => {
    const { bookId } = req.params;
    const { title, description, price, stockQuantity } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');  // Start transaction

        // Update book details
        await client.query(
            'UPDATE Books SET Title = $1, Description = $2, Price = $3 WHERE Book_ID = $4',
            [title, description, price, bookId]
        );

        // Update inventory quantity if provided
        if (stockQuantity !== undefined) {
            await client.query(
                'UPDATE Inventory SET Stock_Quantity = $1 WHERE Book_ID = $2',
                [stockQuantity, bookId]
            );
        }

        await client.query('COMMIT');  // Commit the transaction
        return res.status(200).send('Book updated successfully');
    } catch (err) {
        await client.query('ROLLBACK');  // Rollback transaction on error
        return res.status(500).send(`Error updating book: ${err.message}`);
    } finally {
        client.release();  // Release the client back to the pool
    }
};

module.exports = {
    addBook,
    getApprovedBooks,
    getBooksByWriter,
    getBookById,
    updateBook,
};
