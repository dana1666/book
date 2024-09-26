


// const checkout = async (req, res) => {
//     const { buyerId, paymentMethod } = req.body;
//     try {
//         const pool = await poolPromise;

//         // Get cart items
//         const cartItems = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .query("SELECT * FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = @Buyer_ID)");

//         if (cartItems.recordset.length === 0) {
//             return res.status(400).send('Cart is empty');
//         }

//         // Check stock levels for each item
//         for (let item of cartItems.recordset) {
//             const inventory = await pool.request()
//                 .input('Book_ID', sql.Int, item.Book_ID)
//                 .query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = @Book_ID");

//             const stockQuantity = inventory.recordset[0]?.Stock_Quantity;

//             if (!stockQuantity || stockQuantity < item.Quantity) {
//                 return res.status(400).send(`Not enough stock for the book with ID ${item.Book_ID}`);
//             }
//         }

//         // Calculate total price
//         let totalPrice = 0;
//         for (let item of cartItems.recordset) {
//             totalPrice += item.Quantity * item.Unit_Price;
//         }

//         // Create the order
//         const orderResult = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .input('Total_Price', sql.Decimal(10, 2), totalPrice)
//             .input('Payment_Method', sql.VarChar, paymentMethod)
//             .query("INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) OUTPUT INSERTED.Order_ID VALUES (@Buyer_ID, @Total_Price, @Payment_Method)");

//         const orderId = orderResult.recordset[0].Order_ID;

//         // Insert order items and update inventory
//         for (let item of cartItems.recordset) {
//             await pool.request()
//                 .input('Order_ID', sql.Int, orderId)
//                 .input('Book_ID', sql.Int, item.Book_ID)
//                 .input('Quantity', sql.Int, item.Quantity)
//                 .input('Unit_Price', sql.Decimal(10, 2), item.Unit_Price)
//                 .query("INSERT INTO Order_Items (Order_ID, Book_ID, Quantity, Unit_Price) VALUES (@Order_ID, @Book_ID, @Quantity, @Unit_Price)");

//             await pool.request()
//                 .input('Book_ID', sql.Int, item.Book_ID)
//                 .input('Quantity', sql.Int, item.Quantity)
//                 .query("UPDATE Inventory SET Stock_Quantity = Stock_Quantity - @Quantity WHERE Book_ID = @Book_ID");
//         }

//         // Clear the cart
//         await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .query("DELETE FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = @Buyer_ID)");

//         res.status(201).send({ message: 'Order placed successfully', orderId });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// };

// module.exports = {
//     checkout,
// };
//-------

// const { query } = require('../config/dbConfig'); // Use pg query

// const checkout = async (req, res) => {
//     const { buyerId, paymentMethod } = req.body;
    
//     try {
//         // Get cart items
//         const cartItemsResult = await query(
//             "SELECT * FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)", 
//             [buyerId]
//         );

//         if (cartItemsResult.rows.length === 0) {
//             return res.status(400).send('Cart is empty');
//         }

//         // Check stock levels for each item
//         for (let item of cartItemsResult.rows) {
//             const inventoryResult = await query(
//                 "SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1", 
//                 [item.book_id]
//             );

//             const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

//             if (!stockQuantity || stockQuantity < item.quantity) {
//                 return res.status(400).send(`Not enough stock for the book with ID ${item.book_id}`);
//             }
//         }

//         // Calculate total price
//         let totalPrice = 0;
//         for (let item of cartItemsResult.rows) {
//             totalPrice += item.quantity * item.unit_price;
//         }

//         // Create the order
//         const orderResult = await query(
//             "INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) RETURNING Order_ID", 
//             [buyerId, totalPrice, paymentMethod]
//         );

//         const orderId = orderResult.rows[0].order_id;

//         // Insert order items and update inventory
//         for (let item of cartItemsResult.rows) {
//             await query(
//                 "INSERT INTO Order_Items (Order_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)", 
//                 [orderId, item.book_id, item.quantity, item.unit_price]
//             );

//             await query(
//                 "UPDATE Inventory SET Stock_Quantity = Stock_Quantity - $1 WHERE Book_ID = $2", 
//                 [item.quantity, item.book_id]
//             );
//         }

//         // Clear the cart
//         await query(
//             "DELETE FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)", 
//             [buyerId]
//         );

//         res.status(201).send({ message: 'Order placed successfully', orderId });
//     } catch (err) {
//         console.error('Error during checkout:', err.message);
//         res.status(500).send(err.message);
//     }
// };

// module.exports = {
//     checkout,
// };
//===========
const { Pool } = require('../config/dbConfig'); // Use pg pool
const pool = new Pool();

const checkout = async (req, res) => {
    const { buyerId, paymentMethod } = req.body;

    // Validate input
    if (!buyerId || !paymentMethod) {
        return res.status(400).send('Buyer ID and payment method are required.');
    }

    const client = await pool.connect();  // Start transaction

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

        // Get inventory stock levels for all books in the cart in one query
        const bookIds = cartItemsResult.rows.map(item => item.book_id);
        const inventoryResult = await client.query(
            "SELECT Book_ID, Stock_Quantity FROM Inventory WHERE Book_ID = ANY($1)",
            [bookIds]
        );

        const inventoryMap = new Map();
        inventoryResult.rows.forEach(item => {
            inventoryMap.set(item.book_id, item.stock_quantity);
        });

        // Check stock levels for each item
        for (let item of cartItemsResult.rows) {
            const stockQuantity = inventoryMap.get(item.book_id);

            if (!stockQuantity || stockQuantity < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).send(`Not enough stock for the book with ID ${item.book_id}`);
            }
        }

        // Calculate total price
        let totalPrice = 0;
        for (let item of cartItemsResult.rows) {
            totalPrice += item.quantity * item.unit_price;
        }

        // Create the order
        const orderResult = await client.query(
            "INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) VALUES ($1, $2, $3) RETURNING Order_ID", 
            [buyerId, totalPrice, paymentMethod]
        );

        const orderId = orderResult.rows[0].order_id;

        // Insert order items and update inventory
        for (let item of cartItemsResult.rows) {
            await client.query(
                "INSERT INTO Order_Items (Order_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)", 
                [orderId, item.book_id, item.quantity, item.unit_price]
            );

            await client.query(
                "UPDATE Inventory SET Stock_Quantity = Stock_Quantity - $1 WHERE Book_ID = $2", 
                [item.quantity, item.book_id]
            );
        }

        // Clear the cart
        await client.query(
            "DELETE FROM Cart_Items WHERE Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)", 
            [buyerId]
        );

        await client.query('COMMIT');  // Commit the transaction
        res.status(201).send({ message: 'Order placed successfully', orderId });
    } catch (err) {
        await client.query('ROLLBACK');  // Rollback transaction on error
        console.error('Error during checkout:', err.message);
        res.status(500).send(`Error during checkout: ${err.message}`);
    } finally {
        client.release();  // Release the client back to the pool
    }
};

module.exports = {
    checkout,
};
