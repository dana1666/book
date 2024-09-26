
// const express = require('express');
// const { sql, poolPromise } = require('../config/dbConfig');
// const router = express.Router();

// // Add book to cart
// router.post('/add', async (req, res) => {
//     const { buyerId, bookId, quantity } = req.body;
//     try {
//         const pool = await poolPromise;

//         // Check if the book is in stock
//         const inventoryResult = await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = @Book_ID");

//         const stockQuantity = inventoryResult.recordset[0]?.Stock_Quantity;

//         if (stockQuantity === undefined) {
//             return res.status(400).send('Book not found in inventory');
//         }

//         if (stockQuantity < quantity) {
//             return res.status(400).send('Not enough stock available');
//         }

//         // Check if the buyer has an existing cart
//         let cartResult = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = @Buyer_ID");

//         let cartId = cartResult.recordset[0]?.Cart_ID;

//         // If no cart exists, create one
//         if (!cartId) {
//             cartResult = await pool.request()
//                 .input('Buyer_ID', sql.Int, buyerId)
//                 .query("INSERT INTO Cart (Buyer_ID) OUTPUT INSERTED.Cart_ID VALUES (@Buyer_ID)");

//             cartId = cartResult.recordset[0]?.Cart_ID;
//             if (!cartId) {
//                 return res.status(500).send('Failed to create a new cart');
//             }
//         }

//         // Retrieve the price of the book
//         const priceResult = await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .query("SELECT Price FROM Books WHERE Book_ID = @Book_ID");

//         const price = priceResult.recordset[0]?.Price;

//         if (price === undefined) {
//             return res.status(400).send('Price not found for the selected book');
//         }

//         // Add the book to the cart
//         await pool.request()
//             .input('Cart_ID', sql.Int, cartId)
//             .input('Book_ID', sql.Int, bookId)
//             .input('Quantity', sql.Int, quantity)
//             .input('Unit_Price', sql.Decimal(10, 2), price)
//             .query("INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES (@Cart_ID, @Book_ID, @Quantity, @Unit_Price)");

//         res.status(201).send('Book added to cart');
//     } catch (err) {
//         console.error('Error adding book to cart:', err.message); 
//         res.status(500).send(err.message);
//     }
// });

// module.exports = router;
//--------

// const express = require('express');
// const { query } = require('../config/dbConfig');
// const router = express.Router();

// // Add book to cart
// router.post('/add', async (req, res) => {
//     const { buyerId, bookId, quantity } = req.body;

//     try {
//         // Check if the book is in stock
//         const inventoryResult = await query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1", [bookId]);

//         const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

//         if (stockQuantity === undefined) {
//             return res.status(400).send('Book not found in inventory');
//         }

//         if (stockQuantity < quantity) {
//             return res.status(400).send('Not enough stock available');
//         }

//         // Check if the buyer has an existing cart
//         const cartResult = await query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1", [buyerId]);
//         let cartId = cartResult.rows[0]?.cart_id;

//         // If no cart exists, create one
//         if (!cartId) {
//             const newCartResult = await query("INSERT INTO Cart (Buyer_ID) RETURNING Cart_ID", [buyerId]);
//             cartId = newCartResult.rows[0]?.cart_id;

//             if (!cartId) {
//                 return res.status(500).send('Failed to create a new cart');
//             }
//         }

//         // Retrieve the price of the book
//         const priceResult = await query("SELECT Price FROM Books WHERE Book_ID = $1", [bookId]);
//         const price = priceResult.rows[0]?.price;

//         if (price === undefined) {
//             return res.status(400).send('Price not found for the selected book');
//         }

//         // Add the book to the cart
//         await query(
//             "INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)",
//             [cartId, bookId, quantity, price]
//         );

//         res.status(201).send('Book added to cart');
//     } catch (err) {
//         console.error('Error adding book to cart:', err.message);
//         res.status(500).send(err.message);
//     }
// });

// module.exports = router;

// routes/cartController.js

const express = require('express');
const pool = require('../config/dbConfig');  // Use pool from your dbConfig
const router = express.Router();

// Add book to cart
router.post('/add', async (req, res) => {
    const { buyerId, bookId, quantity } = req.body;

    // Validate input
    if (!buyerId || !bookId || !quantity || quantity <= 0) {
        return res.status(400).send('Buyer ID, book ID, and a valid quantity are required.');
    }

    try {
        // Start a transaction
        const client = await pool.connect();
        await client.query('BEGIN');

        // Check if the book is in stock
        const inventoryResult = await client.query(
            "SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1",
            [bookId]
        );
        const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

        if (stockQuantity === undefined) {
            await client.query('ROLLBACK');
            return res.status(400).send('Book not found in inventory');
        }

        if (stockQuantity < quantity) {
            await client.query('ROLLBACK');
            return res.status(400).send('Not enough stock available');
        }

        // Check if the buyer has an existing cart
        let cartResult = await client.query(
            "SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1",
            [buyerId]
        );
        let cartId = cartResult.rows[0]?.cart_id;

        // If no cart exists, create one
        if (!cartId) {
            const newCartResult = await client.query(
                "INSERT INTO Cart (Buyer_ID) VALUES ($1) RETURNING Cart_ID",
                [buyerId]
            );
            cartId = newCartResult.rows[0]?.cart_id;

            if (!cartId) {
                await client.query('ROLLBACK');
                return res.status(500).send('Failed to create a new cart');
            }
        }

        // Retrieve the price of the book
        const priceResult = await client.query(
            "SELECT Price FROM Books WHERE Book_ID = $1",
            [bookId]
        );
        const price = priceResult.rows[0]?.price;

        if (price === undefined) {
            await client.query('ROLLBACK');
            return res.status(400).send('Price not found for the selected book');
        }

        // Add the book to the cart
        await client.query(
            "INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)",
            [cartId, bookId, quantity, price]
        );

        await client.query('COMMIT');  // Commit the transaction
        res.status(201).send('Book added to cart');
    } catch (err) {
        await client.query('ROLLBACK');  // Rollback transaction on error
        console.error('Error adding book to cart:', err.message);
        res.status(500).send(`Error adding book to cart: ${err.message}`);
    } finally {
        client.release();  // Release the client back to the pool
    }
});

module.exports = router;
