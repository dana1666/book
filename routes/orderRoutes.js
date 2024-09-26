// const express = require('express');
// const { sql, poolPromise } = require('../config/dbConfig');
// const router = express.Router();

// // Checkout and create order 
// router.post('/checkout', async (req, res) => {
//     const { buyerId } = req.body;
//     try {
//         const pool = await poolPromise;

//         // Get cart items
//         const cartItems = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .query("SELECT * FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = @Buyer_ID)");

//         if (cartItems.recordset.length === 0) {
//             return res.status(400).send('Cart is empty');
//         }

//         // Calculate total price
//         let totalPrice = 0;
//         for (let item of cartItems.recordset) {
//             totalPrice += item.Quantity * item.Unit_Price;
//         }

//         // Create order with a default status 'Pending Payment'
//         const orderResult = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .input('Total_Price', sql.Decimal(10, 2), totalPrice)
//             .input('Payment_Method', sql.VarChar, 'Pending')
//             .query("INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) OUTPUT INSERTED.Order_ID VALUES (@Buyer_ID, @Total_Price, @Payment_Method)");

//         const orderId = orderResult.recordset[0].Order_ID;

//         // Insert order items
//         for (let item of cartItems.recordset) {
//             await pool.request()
//                 .input('Order_ID', sql.Int, orderId)
//                 .input('Book_ID', sql.Int, item.Book_ID)
//                 .input('Quantity', sql.Int, item.Quantity)
//                 .input('Unit_Price', sql.Decimal(10, 2), item.Unit_Price)
//                 .query("INSERT INTO Order_Items (Order_ID, Book_ID, Quantity, Unit_Price) VALUES (@Order_ID, @Book_ID, @Quantity, @Unit_Price)");
//         }

//         // Return orderId and totalPrice to navigate to payment page
//         res.status(201).json({ orderId, totalPrice });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // Finalize the order with payment method
// router.post('/finalize', async (req, res) => {
//     const { orderId, buyerId, paymentMethod } = req.body;

//     try {
//         const pool = await poolPromise;

//         // Finalize the order by updating the payment method
//         await pool.request()
//             .input('Order_ID', sql.Int, orderId)
//             .input('Payment_Method', sql.VarChar, paymentMethod)
//             .query("UPDATE Orders SET Payment_Method = @Payment_Method WHERE Order_ID = @Order_ID");

//         // Reduce the stock quantity for each item in the order
//         const orderItems = await pool.request()
//             .input('Order_ID', sql.Int, orderId)
//             .query("SELECT * FROM Order_Items WHERE Order_ID = @Order_ID");

//         for (let item of orderItems.recordset) {
//             await pool.request()
//                 .input('Book_ID', sql.Int, item.Book_ID)
//                 .input('Quantity', sql.Int, item.Quantity)
//                 .query("UPDATE Inventory SET Stock_Quantity = Stock_Quantity - @Quantity WHERE Book_ID = @Book_ID");
//         }

//         // Clear the cart after the order is finalized
//         await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .query("DELETE FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = @Buyer_ID)");

//         res.status(200).send('Order finalized successfully');
//     } catch (err) {
//         res.status(500).send(`Error finalizing order: ${err.message}`);
//     }
// });

// // View order details
// router.get('/:orderId', async (req, res) => {
//     const { orderId } = req.params;
//     try {
//         const pool = await poolPromise;

//         const order = await pool.request()
//             .input('Order_ID', sql.Int, orderId)
//             .query("SELECT * FROM Orders WHERE Order_ID = @Order_ID");

//         const orderItems = await pool.request()
//             .input('Order_ID', sql.Int, orderId)
//             .query("SELECT * FROM Order_Items WHERE Order_ID = @Order_ID");

//         res.json({ order: order.recordset[0], items: orderItems.recordset });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// module.exports = router;

// const express = require('express');
// const { query } = require('../config/dbConfig');  // Import the pg query function
// const router = express.Router();

// // Checkout and create order 
// router.post('/checkout', async (req, res) => {
//     const { buyerId } = req.body;
//     try {
//         // Get cart items
//         const cartItemsResult = await query(
//             "SELECT * FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)",
//             [buyerId]
//         );

//         if (cartItemsResult.rows.length === 0) {
//             return res.status(400).send('Cart is empty');
//         }

//         // Calculate total price
//         let totalPrice = 0;
//         for (let item of cartItemsResult.rows) {
//             totalPrice += item.quantity * item.unit_price;
//         }

//         // Create order with a default status 'Pending Payment'
//         const orderResult = await query(
//             "INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) VALUES ($1, $2, 'Pending') RETURNING Order_ID",
//             [buyerId, totalPrice]
//         );

//         const orderId = orderResult.rows[0].order_id;

//         // Insert order items
//         for (let item of cartItemsResult.rows) {
//             await query(
//                 "INSERT INTO Order_Items (Order_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)",
//                 [orderId, item.book_id, item.quantity, item.unit_price]
//             );
//         }

//         // Return orderId and totalPrice to navigate to payment page
//         res.status(201).json({ orderId, totalPrice });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// // Finalize the order with payment method
// router.post('/finalize', async (req, res) => {
//     const { orderId, buyerId, paymentMethod } = req.body;

//     try {
//         // Finalize the order by updating the payment method
//         await query(
//             "UPDATE Orders SET Payment_Method = $1 WHERE Order_ID = $2",
//             [paymentMethod, orderId]
//         );

//         // Reduce the stock quantity for each item in the order
//         const orderItemsResult = await query(
//             "SELECT * FROM Order_Items WHERE Order_ID = $1",
//             [orderId]
//         );

//         for (let item of orderItemsResult.rows) {
//             await query(
//                 "UPDATE Inventory SET Stock_Quantity = Stock_Quantity - $1 WHERE Book_ID = $2",
//                 [item.quantity, item.book_id]
//             );
//         }

//         // Clear the cart after the order is finalized
//         await query(
//             "DELETE FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)",
//             [buyerId]
//         );

//         res.status(200).send('Order finalized successfully');
//     } catch (err) {
//         res.status(500).send(`Error finalizing order: ${err.message}`);
//     }
// });

// // View order details
// router.get('/:orderId', async (req, res) => {
//     const { orderId } = req.params;
//     try {
//         const orderResult = await query(
//             "SELECT * FROM Orders WHERE Order_ID = $1",
//             [orderId]
//         );

//         const orderItemsResult = await query(
//             "SELECT * FROM Order_Items WHERE Order_ID = $1",
//             [orderId]
//         );

//         res.json({ order: orderResult.rows[0], items: orderItemsResult.rows });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// module.exports = router;
//===========================

const express = require('express');
const pool = require('../config/dbConfig');  // Import the existing pool from dbConfig.js
const router = express.Router();

// Checkout and create order 
router.post('/checkout', async (req, res) => {
    const { buyerId } = req.body;

    // Validate input
    if (!buyerId) {
        return res.status(400).send('Buyer ID is required');
    }

    const client = await pool.connect();  // Use the existing pool

    try {
        await client.query('BEGIN');

        // Get cart items
        const cartItemsResult = await client.query(
            "SELECT * FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)",
            [buyerId]
        );

        if (cartItemsResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).send('Cart is empty');
        }

        // Calculate total price
        let totalPrice = 0;
        for (let item of cartItemsResult.rows) {
            totalPrice += item.quantity * item.unit_price;
        }

        // Create order with a default status 'Pending Payment'
        const orderResult = await client.query(
            "INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) VALUES ($1, $2, 'Pending') RETURNING Order_ID",
            [buyerId, totalPrice]
        );

        const orderId = orderResult.rows[0].order_id;

        // Insert order items
        for (let item of cartItemsResult.rows) {
            await client.query(
                "INSERT INTO Order_Items (Order_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)",
                [orderId, item.book_id, item.quantity, item.unit_price]
            );
        }

        await client.query('COMMIT');  // Commit transaction

        // Return orderId and totalPrice to navigate to payment page
        res.status(201).json({ orderId, totalPrice });
    } catch (err) {
        await client.query('ROLLBACK');  // Rollback transaction on error
        console.error('Error during checkout:', err.message);
        res.status(500).send(`Error during checkout: ${err.message}`);
    } finally {
        client.release();
    }
});

// Finalize the order with payment method
router.post('/finalize', async (req, res) => {
    const { orderId, buyerId, paymentMethod } = req.body;

    // Validate input
    if (!orderId || !buyerId || !paymentMethod) {
        return res.status(400).send('Order ID, Buyer ID, and Payment Method are required');
    }

    const client = await pool.connect();  // Use the existing pool

    try {
        await client.query('BEGIN');

        // Finalize the order by updating the payment method
        await client.query(
            "UPDATE Orders SET Payment_Method = $1 WHERE Order_ID = $2",
            [paymentMethod, orderId]
        );

        // Reduce the stock quantity for each item in the order
        const orderItemsResult = await client.query(
            "SELECT * FROM Order_Items WHERE Order_ID = $1",
            [orderId]
        );

        for (let item of orderItemsResult.rows) {
            await client.query(
                "UPDATE Inventory SET Stock_Quantity = Stock_Quantity - $1 WHERE Book_ID = $2",
                [item.quantity, item.book_id]
            );
        }

        // Clear the cart after the order is finalized
        await client.query(
            "DELETE FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)",
            [buyerId]
        );

        await client.query('COMMIT');  // Commit transaction

        res.status(200).send('Order finalized successfully');
    } catch (err) {
        await client.query('ROLLBACK');  // Rollback transaction on error
        console.error('Error finalizing order:', err.message);
        res.status(500).send(`Error finalizing order: ${err.message}`);
    } finally {
        client.release();
    }
});

// View order details
router.get('/:orderId', async (req, res) => {
    const { orderId } = req.params;

    // Validate input
    if (!orderId) {
        return res.status(400).send('Order ID is required');
    }

    try {
        const orderResult = await pool.query(
            "SELECT * FROM Orders WHERE Order_ID = $1",
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found');
        }

        const orderItemsResult = await pool.query(
            "SELECT * FROM Order_Items WHERE Order_ID = $1",
            [orderId]
        );

        res.json({ order: orderResult.rows[0], items: orderItemsResult.rows });
    } catch (err) {
        res.status(500).send(`Error retrieving order details: ${err.message}`);
    }
});

module.exports = router;

