

// const express = require('express');
// const { sql, poolPromise } = require('../config/dbConfig');
// const authMiddleware = require('../middleware/authMiddleware'); 
// const router = express.Router();


// router.use(authMiddleware());  

// // Add book to cart
// router.post('/add', async (req, res) => {
//     const buyerId = req.user.userId;  
//     const { bookId, quantity } = req.body;

//     try {
//         const pool = await poolPromise;

//         // Check if the book is in stock
//         const inventoryResult = await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = @Book_ID");

//         const stockQuantity = inventoryResult.recordset[0]?.Stock_Quantity;

//         if (stockQuantity === undefined) {
//             return res.status(400).json({ error: 'Book not found in inventory' });
//         }

//         if (stockQuantity < quantity) {
//             return res.status(400).json({ error: 'Not enough stock available' });
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
//                 return res.status(500).json({ error: 'Failed to create a new cart' });
//             }
//         }

//         // Retrieve the price of the book
//         const priceResult = await pool.request()
//             .input('Book_ID', sql.Int, bookId)
//             .query("SELECT Price FROM Books WHERE Book_ID = @Book_ID");

//         const price = priceResult.recordset[0]?.Price;

//         if (price === undefined) {
//             return res.status(400).json({ error: 'Price not found for the selected book' });
//         }

//         // Add the book to the cart
//         await pool.request()
//             .input('Cart_ID', sql.Int, cartId)
//             .input('Book_ID', sql.Int, bookId)
//             .input('Quantity', sql.Int, quantity)
//             .input('Unit_Price', sql.Decimal(10, 2), price)
//             .query("INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES (@Cart_ID, @Book_ID, @Quantity, @Unit_Price)");

//         res.status(201).json({ message: 'Book added to cart' });
//     } catch (err) {
//         console.error('Error adding book to cart:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Get all items in the cart for a buyer
// router.get('/', async (req, res) => {
//     const buyerId = req.user.userId;  
//     try {
//         const pool = await poolPromise;
//         const result = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .query(
//                 `SELECT ci.Cart_Item_ID, ci.Quantity, ci.Unit_Price, b.Title, b.Image_Path
//                 FROM Cart_Items ci
//                 JOIN Books b ON ci.Book_ID = b.Book_ID
//                 WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = @Buyer_ID)`
//             );

//         res.json(result.recordset);
//     } catch (err) {
//         console.error('Error retrieving cart items:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update quantity of a cart item
// router.put('/update', async (req, res) => {
//     const { cartItemId, newQuantity } = req.body;
//     try {
//         const pool = await poolPromise;

//         // Check if the book is in stock before updating the quantity
//         const cartItemResult = await pool.request()
//             .input('Cart_Item_ID', sql.Int, cartItemId)
//             .query(
//                 `SELECT ci.Quantity, i.Stock_Quantity, b.Title 
//                 FROM Cart_Items ci
//                 JOIN Inventory i ON ci.Book_ID = i.Book_ID 
//                 JOIN Books b ON ci.Book_ID = b.Book_ID
//                 WHERE ci.Cart_Item_ID = @Cart_Item_ID`
//             );

//         const cartItem = cartItemResult.recordset[0];
//         if (!cartItem) {
//             return res.status(404).json({ error: 'Cart item not found' });
//         }

//         if (newQuantity > cartItem.Stock_Quantity) {
//             return res.status(400).json({ error: 'Not enough stock available', bookTitle: cartItem.Title });
//         }

//         // Update the cart item quantity
//         await pool.request()
//             .input('Cart_Item_ID', sql.Int, cartItemId)
//             .input('Quantity', sql.Int, newQuantity)
//             .query("UPDATE Cart_Items SET Quantity = @Quantity WHERE Cart_Item_ID = @Cart_Item_ID");

//         res.status(200).json({ message: 'Cart item updated' });
//     } catch (err) {
//         console.error('Error updating cart item:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Remove a cart item
// router.delete('/remove/:cartItemId', async (req, res) => {
//     const { cartItemId } = req.params;
//     try {
//         const pool = await poolPromise;

//         // Remove the cart item
//         await pool.request()
//             .input('Cart_Item_ID', sql.Int, cartItemId)
//             .query("DELETE FROM Cart_Items WHERE Cart_Item_ID = @Cart_Item_ID");

//         res.status(200).json({ message: 'Cart item removed' });
//     } catch (err) {
//         console.error('Error removing cart item:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Check if all items in the cart have enough stock before proceeding to payment
// router.post('/check', async (req, res) => {
//     const buyerId = req.user.userId;

//     try {
//         const pool = await poolPromise;

//         const cartItems = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .query(
//                 `SELECT ci.Quantity, ci.Unit_Price, i.Stock_Quantity, b.Title 
//                 FROM Cart_Items ci 
//                 JOIN Inventory i ON ci.Book_ID = i.Book_ID 
//                 JOIN Books b ON ci.Book_ID = b.Book_ID
//                 WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = @Buyer_ID)`
//             );

//         for (let item of cartItems.recordset) {
//             if (item.Quantity > item.Stock_Quantity) {
//                 return res.status(400).json({ error: 'Not enough stock available', bookTitle: item.Title });
//             }
//         }

//         // Calculate total price
//         const totalPrice = cartItems.recordset.reduce((sum, item) => sum + item.Quantity * item.Unit_Price, 0);

       
//         const orderResult = await pool.request()
//             .input('Buyer_ID', sql.Int, buyerId)
//             .input('Total_Price', sql.Decimal(10, 2), totalPrice)
//             .input('Payment_Method', sql.VarChar, '') // No payment method yet
//             .query("INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) OUTPUT INSERTED.Order_ID VALUES (@Buyer_ID, @Total_Price, @Payment_Method)");

//         const orderId = orderResult.recordset[0].Order_ID;

//         res.json({ orderId, totalPrice });
//     } catch (err) {
//         console.error('Error during checkout:', err.message);
//         res.status(500).json({ error: `Error during checkout: ${err.message}` });
//     }
// });

// module.exports = router;

//--------

// const express = require('express');
// const { query } = require('../config/dbConfig');  // Import the pg query function
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// router.use(authMiddleware());  // Use authentication middleware

// // Add book to cart
// router.post('/add', async (req, res) => {
//     const buyerId = req.user.userId;
//     const { bookId, quantity } = req.body;

//     try {
//         // Check if the book is in stock
//         const inventoryResult = await query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1", [bookId]);

//         const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

//         if (stockQuantity === undefined) {
//             return res.status(400).json({ error: 'Book not found in inventory' });
//         }

//         if (stockQuantity < quantity) {
//             return res.status(400).json({ error: 'Not enough stock available' });
//         }

//         // Check if the buyer has an existing cart
//         let cartResult = await query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1", [buyerId]);

//         let cartId = cartResult.rows[0]?.cart_id;

//         // If no cart exists, create one
//         if (!cartId) {
//             cartResult = await query("INSERT INTO Cart (Buyer_ID) RETURNING Cart_ID", [buyerId]);
//             cartId = cartResult.rows[0]?.cart_id;

//             if (!cartId) {
//                 return res.status(500).json({ error: 'Failed to create a new cart' });
//             }
//         }

//         // Retrieve the price of the book
//         const priceResult = await query("SELECT Price FROM Books WHERE Book_ID = $1", [bookId]);
//         const price = priceResult.rows[0]?.price;

//         if (price === undefined) {
//             return res.status(400).json({ error: 'Price not found for the selected book' });
//         }

//         // Add the book to the cart
//         await query("INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)", [cartId, bookId, quantity, price]);

//         res.status(201).json({ message: 'Book added to cart' });
//     } catch (err) {
//         console.error('Error adding book to cart:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Get all items in the cart for a buyer
// router.get('/', async (req, res) => {
//     const buyerId = req.user.userId;
//     try {
//         const result = await query(
//             `SELECT ci.Cart_Item_ID, ci.Quantity, ci.Unit_Price, b.Title, b.Image_Path
//             FROM Cart_Items ci
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
//         );

//         res.json(result.rows);
//     } catch (err) {
//         console.error('Error retrieving cart items:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update quantity of a cart item
// router.put('/update', async (req, res) => {
//     const { cartItemId, newQuantity } = req.body;
//     try {
//         const cartItemResult = await query(
//             `SELECT ci.Quantity, i.Stock_Quantity, b.Title
//             FROM Cart_Items ci
//             JOIN Inventory i ON ci.Book_ID = i.Book_ID
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_Item_ID = $1`, [cartItemId]
//         );

//         const cartItem = cartItemResult.rows[0];
//         if (!cartItem) {
//             return res.status(404).json({ error: 'Cart item not found' });
//         }

//         if (newQuantity > cartItem.stock_quantity) {
//             return res.status(400).json({ error: 'Not enough stock available', bookTitle: cartItem.title });
//         }

//         await query("UPDATE Cart_Items SET Quantity = $1 WHERE Cart_Item_ID = $2", [newQuantity, cartItemId]);

//         res.status(200).json({ message: 'Cart item updated' });
//     } catch (err) {
//         console.error('Error updating cart item:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Remove a cart item
// router.delete('/remove/:cartItemId', async (req, res) => {
//     const { cartItemId } = req.params;
//     try {
//         await query("DELETE FROM Cart_Items WHERE Cart_Item_ID = $1", [cartItemId]);
//         res.status(200).json({ message: 'Cart item removed' });
//     } catch (err) {
//         console.error('Error removing cart item:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Check if all items in the cart have enough stock before proceeding to payment
// router.post('/check', async (req, res) => {
//     const buyerId = req.user.userId;

//     try {
//         const cartItems = await query(
//             `SELECT ci.Quantity, ci.Unit_Price, i.Stock_Quantity, b.Title
//             FROM Cart_Items ci
//             JOIN Inventory i ON ci.Book_ID = i.Book_ID
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
//         );

//         for (let item of cartItems.rows) {
//             if (item.quantity > item.stock_quantity) {
//                 return res.status(400).json({ error: 'Not enough stock available', bookTitle: item.title });
//             }
//         }

//         const totalPrice = cartItems.rows.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

//         const orderResult = await query(
//             "INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) VALUES ($1, $2, $3) RETURNING Order_ID",
//             [buyerId, totalPrice, 'Pending']
//         );

//         const orderId = orderResult.rows[0].order_id;

//         res.json({ orderId, totalPrice });
//     } catch (err) {
//         console.error('Error during checkout:', err.message);
//         res.status(500).json({ error: `Error during checkout: ${err.message}` });
//     }
// });

// module.exports = router;
//=========


// const express = require('express');
// const { query } = require('../config/dbConfig');  // Import the pg query function
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// router.use(authMiddleware());  // Use authentication middleware

// // Add book to cart
// router.post('/add', async (req, res) => {
//     const buyerId = req.user.userId;
//     const { bookId, quantity } = req.body;

//     if (!bookId || !quantity || quantity <= 0) {
//         return res.status(400).json({ error: 'Invalid book ID or quantity' });
//     }

//     try {
//         // Check if the book is in stock
//         const inventoryResult = await query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1", [bookId]);

//         const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

//         if (stockQuantity === undefined) {
//             return res.status(400).json({ error: 'Book not found in inventory' });
//         }

//         if (stockQuantity < quantity) {
//             return res.status(400).json({ error: 'Not enough stock available' });
//         }

//         // Check if the buyer has an existing cart
//         let cartResult = await query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1", [buyerId]);

//         let cartId = cartResult.rows[0]?.cart_id;

//         // If no cart exists, create one
//         if (!cartId) {
//             cartResult = await query("INSERT INTO Cart (Buyer_ID) RETURNING Cart_ID", [buyerId]);
//             cartId = cartResult.rows[0]?.cart_id;

//             if (!cartId) {
//                 return res.status(500).json({ error: 'Failed to create a new cart' });
//             }
//         }

//         // Retrieve the price of the book
//         const priceResult = await query("SELECT Price FROM Books WHERE Book_ID = $1", [bookId]);
//         const price = priceResult.rows[0]?.price;

//         if (price === undefined) {
//             return res.status(400).json({ error: 'Price not found for the selected book' });
//         }

//         // Add the book to the cart
//         await query("INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)", [cartId, bookId, quantity, price]);

//         res.status(201).json({ message: 'Book added to cart' });
//     } catch (err) {
//         console.error('Error adding book to cart:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Get all items in the cart for a buyer
// router.get('/', async (req, res) => {
//     const buyerId = req.user.userId;
//     try {
//         const result = await query(
//             `SELECT ci.Cart_Item_ID, ci.Quantity, ci.Unit_Price, b.Title, b.Image_Path
//             FROM Cart_Items ci
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
//         );

//         res.json(result.rows);
//     } catch (err) {
//         console.error('Error retrieving cart items:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update quantity of a cart item
// router.put('/update', async (req, res) => {
//     const { cartItemId, newQuantity } = req.body;

//     if (!cartItemId || !newQuantity || newQuantity <= 0) {
//         return res.status(400).json({ error: 'Invalid cart item ID or quantity' });
//     }

//     try {
//         const cartItemResult = await query(
//             `SELECT ci.Quantity, i.Stock_Quantity, b.Title
//             FROM Cart_Items ci
//             JOIN Inventory i ON ci.Book_ID = i.Book_ID
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_Item_ID = $1`, [cartItemId]
//         );

//         const cartItem = cartItemResult.rows[0];
//         if (!cartItem) {
//             return res.status(404).json({ error: 'Cart item not found' });
//         }

//         if (newQuantity > cartItem.stock_quantity) {
//             return res.status(400).json({ error: 'Not enough stock available', bookTitle: cartItem.title });
//         }

//         await query("UPDATE Cart_Items SET Quantity = $1 WHERE Cart_Item_ID = $2", [newQuantity, cartItemId]);

//         res.status(200).json({ message: 'Cart item updated' });
//     } catch (err) {
//         console.error('Error updating cart item:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Remove a cart item
// router.delete('/remove/:cartItemId', async (req, res) => {
//     const { cartItemId } = req.params;

//     if (!cartItemId) {
//         return res.status(400).json({ error: 'Invalid cart item ID' });
//     }

//     try {
//         await query("DELETE FROM Cart_Items WHERE Cart_Item_ID = $1", [cartItemId]);
//         res.status(200).json({ message: 'Cart item removed' });
//     } catch (err) {
//         console.error('Error removing cart item:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Check if all items in the cart have enough stock before proceeding to payment
// router.post('/check', async (req, res) => {
//     const buyerId = req.user.userId;

//     try {
//         const cartItems = await query(
//             `SELECT ci.Quantity, ci.Unit_Price, i.Stock_Quantity, b.Title
//             FROM Cart_Items ci
//             JOIN Inventory i ON ci.Book_ID = i.Book_ID
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
//         );

//         for (let item of cartItems.rows) {
//             if (item.quantity > item.stock_quantity) {
//                 return res.status(400).json({ error: 'Not enough stock available', bookTitle: item.title });
//             }
//         }

//         const totalPrice = cartItems.rows.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

//         const orderResult = await query(
//             "INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) VALUES ($1, $2, $3) RETURNING Order_ID",
//             [buyerId, totalPrice, 'Pending']
//         );

//         const orderId = orderResult.rows[0].order_id;

//         res.json({ orderId, totalPrice });
//     } catch (err) {
//         console.error('Error during checkout:', err.message);
//         res.status(500).json({ error: `Error during checkout: ${err.message}` });
//     }
// });

// module.exports = router;


//000
// const express = require('express');
// const pool = require('../config/dbConfig');  // Use pool directly from dbConfig
// const authMiddleware = require('../middleware/authMiddleware');  // Make sure only authMiddleware is used
// const router = express.Router();

// // Use authentication middleware
// router.use(authMiddleware());  // Apply authentication middleware for all routes

// // Add book to cart
// router.post('/add', async (req, res) => {
//     const buyerId = req.user.userId;
//     const { bookId, quantity } = req.body;

//     if (!bookId || !quantity || quantity <= 0) {
//         return res.status(400).json({ error: 'Invalid book ID or quantity' });
//     }

//     try {
//         // Check if the book is in stock
//         const inventoryResult = await pool.query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1", [bookId]);
//         const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

//         if (stockQuantity === undefined) {
//             return res.status(400).json({ error: 'Book not found in inventory' });
//         }

//         if (stockQuantity < quantity) {
//             return res.status(400).json({ error: 'Not enough stock available' });
//         }

//         // Check if the buyer has an existing cart
//         let cartResult = await pool.query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1", [buyerId]);

//         let cartId = cartResult.rows[0]?.cart_id;

//         // If no cart exists, create one
//         if (!cartId) {
//             cartResult = await pool.query("INSERT INTO Cart (Buyer_ID) RETURNING Cart_ID", [buyerId]);
//             cartId = cartResult.rows[0]?.cart_id;

//             if (!cartId) {
//                 return res.status(500).json({ error: 'Failed to create a new cart' });
//             }
//         }

//         // Retrieve the price of the book
//         const priceResult = await pool.query("SELECT Price FROM Books WHERE Book_ID = $1", [bookId]);
//         const price = priceResult.rows[0]?.price;

//         if (price === undefined) {
//             return res.status(400).json({ error: 'Price not found for the selected book' });
//         }

//         // Add the book to the cart
//         await pool.query("INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)", [cartId, bookId, quantity, price]);

//         res.status(201).json({ message: 'Book added to cart' });
//     } catch (err) {
//         console.error('Error adding book to cart:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Get all items in the cart for a buyer
// router.get('/', async (req, res) => {
//     const buyerId = req.user.userId;
//     try {
//         const result = await pool.query(
//             `SELECT ci.Cart_Item_ID, ci.Quantity, ci.Unit_Price, b.Title, b.Image_Path
//             FROM Cart_Items ci
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
//         );

//         res.json(result.rows);
//     } catch (err) {
//         console.error('Error retrieving cart items:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;
//-------


// const express = require('express');
// const pool = require('../config/dbConfig');  // Use pool directly from dbConfig
// const authMiddleware = require('../middleware/authMiddleware');  // Use authMiddleware
// const router = express.Router();

// // Use authentication middleware
// router.use(authMiddleware());  // Apply authentication middleware for all routes

// // Add book to cart
// router.post('/add', async (req, res) => {
//     const buyerId = req.user.userId;
//     const { bookId, quantity } = req.body;

//     if (!bookId || !quantity || quantity <= 0) {
//         return res.status(400).json({ error: 'Invalid book ID or quantity' });
//     }

//     try {
//         // Check if the book is in stock
//         const inventoryResult = await pool.query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1", [bookId]);
//         const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

//         if (stockQuantity === undefined) {
//             return res.status(400).json({ error: 'Book not found in inventory' });
//         }

//         if (stockQuantity < quantity) {
//             return res.status(400).json({ error: 'Not enough stock available' });
//         }

//         // Check if the buyer has an existing cart
//         let cartResult = await pool.query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1", [buyerId]);
//         let cartId = cartResult.rows[0]?.cart_id;

//         // If no cart exists, create one and then retrieve the Cart_ID
//         if (!cartId) {
//             await pool.query("INSERT INTO Cart (Buyer_ID) VALUES ($1)", [buyerId]);
//             const newCartResult = await pool.query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1 ORDER BY Cart_ID DESC LIMIT 1", [buyerId]);
//             cartId = newCartResult.rows[0]?.cart_id;

//             if (!cartId) {
//                 return res.status(500).json({ error: 'Failed to create a new cart' });
//             }
//         }

//         // Retrieve the price of the book
//         const priceResult = await pool.query("SELECT Price FROM Books WHERE Book_ID = $1", [bookId]);
//         const price = priceResult.rows[0]?.price;

//         if (price === undefined) {
//             return res.status(400).json({ error: 'Price not found for the selected book' });
//         }

//         // Add the book to the cart
//         await pool.query(
//             "INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)",
//             [cartId, bookId, quantity, price]
//         );

//         res.status(201).json({ message: 'Book added to cart' });
//     } catch (err) {
//         console.error('Error adding book to cart:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // Get all items in the cart for a buyer
// router.get('/', async (req, res) => {
//     const buyerId = req.user.userId;
//     try {
//         const result = await pool.query(
//             `SELECT ci.Cart_Item_ID, ci.Quantity, ci.Unit_Price, b.Title, b.Image_Path
//             FROM Cart_Items ci
//             JOIN Books b ON ci.Book_ID = b.Book_ID
//             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
//         );

//         res.json(result.rows);
//     } catch (err) {
//         console.error('Error retrieving cart items:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;

const express = require('express');
const pool = require('../config/dbConfig');  // Use pool directly from dbConfig
const authMiddleware = require('../middleware/authMiddleware');  // Use authMiddleware
const router = express.Router();

// Use authentication middleware
router.use(authMiddleware());  // Apply authentication middleware for all routes

// Add book to cart
router.post('/add', async (req, res) => {
    const buyerId = req.user.userId;
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid book ID or quantity' });
    }

    try {
        // Check if the book is in stock
        const inventoryResult = await pool.query("SELECT Stock_Quantity FROM Inventory WHERE Book_ID = $1", [bookId]);
        const stockQuantity = inventoryResult.rows[0]?.stock_quantity;

        if (stockQuantity === undefined) {
            return res.status(400).json({ error: 'Book not found in inventory' });
        }

        if (stockQuantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Check if the buyer has an existing cart
        let cartResult = await pool.query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1", [buyerId]);
        let cartId = cartResult.rows[0]?.cart_id;

        // If no cart exists, create one and then retrieve the Cart_ID
        if (!cartId) {
            await pool.query("INSERT INTO Cart (Buyer_ID) VALUES ($1)", [buyerId]);
            const newCartResult = await pool.query("SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1 ORDER BY Cart_ID DESC LIMIT 1", [buyerId]);
            cartId = newCartResult.rows[0]?.cart_id;

            if (!cartId) {
                return res.status(500).json({ error: 'Failed to create a new cart' });
            }
        }

        // Retrieve the price of the book
        const priceResult = await pool.query("SELECT Price FROM Books WHERE Book_ID = $1", [bookId]);
        const price = priceResult.rows[0]?.price;

        if (price === undefined) {
            return res.status(400).json({ error: 'Price not found for the selected book' });
        }

        // Add the book to the cart
        await pool.query(
            "INSERT INTO Cart_Items (Cart_ID, Book_ID, Quantity, Unit_Price) VALUES ($1, $2, $3, $4)",
            [cartId, bookId, quantity, price]
        );

        res.status(201).json({ message: 'Book added to cart' });
    } catch (err) {
        console.error('Error adding book to cart:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get all items in the cart for a buyer
router.get('/', async (req, res) => {
    const buyerId = req.user.userId;
    try {
        const result = await pool.query(
            `SELECT ci.Cart_Item_ID, ci.Quantity, ci.Unit_Price, b.Title AS title, b.Image_Path AS image_path
             FROM Cart_Items ci
             JOIN Books b ON ci.Book_ID = b.Book_ID
             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error retrieving cart items:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Update the quantity of an item in the cart
router.put('/update', async (req, res) => {
    const { cartItemId, newQuantity } = req.body;

    if (!cartItemId || newQuantity < 0) {
        return res.status(400).json({ error: 'Invalid cart item ID or quantity' });
    }

    try {
        // Check the stock quantity for the book associated with the cart item
        const cartItemResult = await pool.query(
            `SELECT ci.Quantity, i.Stock_Quantity 
             FROM Cart_Items ci 
             JOIN Inventory i ON ci.Book_ID = i.Book_ID 
             WHERE ci.Cart_Item_ID = $1`, [cartItemId]
        );

        const cartItem = cartItemResult.rows[0];

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Ensure that the requested new quantity does not exceed stock quantity
        if (newQuantity > cartItem.stock_quantity) {
            return res.status(400).json({ error: 'Not enough stock available' });
        }

        // Update the cart item quantity
        await pool.query(
            "UPDATE Cart_Items SET Quantity = $1 WHERE Cart_Item_ID = $2",
            [newQuantity, cartItemId]
        );

        res.status(200).json({ message: 'Cart item quantity updated' });
    } catch (err) {
        console.error('Error updating cart item quantity:', err.message);
        res.status(500).json({ error: 'Server error while updating cart item quantity' });
    }
});

// Remove an item from the cart
router.delete('/remove/:cartItemId', async (req, res) => {
    const { cartItemId } = req.params;

    if (!cartItemId) {
        return res.status(400).json({ error: 'Invalid cart item ID' });
    }

    try {
        await pool.query("DELETE FROM Cart_Items WHERE Cart_Item_ID = $1", [cartItemId]);
        res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (err) {
        console.error('Error removing cart item:', err.message);
        res.status(500).json({ error: 'Server error while removing cart item' });
    }
});

// Check if all items in the cart have enough stock before proceeding to payment
router.post('/check', async (req, res) => {
    const buyerId = req.user.userId;

    try {
        const cartItems = await pool.query(
            `SELECT ci.Quantity, ci.Unit_Price, i.Stock_Quantity, b.Title
             FROM Cart_Items ci 
             JOIN Inventory i ON ci.Book_ID = i.Book_ID 
             JOIN Books b ON ci.Book_ID = b.Book_ID
             WHERE ci.Cart_ID = (SELECT Cart_ID FROM Cart WHERE Buyer_ID = $1)`, [buyerId]
        );

        for (let item of cartItems.rows) {
            if (item.quantity > item.stock_quantity) {
                return res.status(400).json({ error: 'Not enough stock available', bookTitle: item.title });
            }
        }

        // Calculate total price
        const totalPrice = cartItems.rows.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

        const orderResult = await pool.query(
            "INSERT INTO Orders (Buyer_ID, Total_Price, Payment_Method) VALUES ($1, $2, $3) RETURNING Order_ID",
            [buyerId, totalPrice, 'Pending']
        );

        const orderId = orderResult.rows[0].order_id;

        res.json({ orderId, totalPrice });
    } catch (err) {
        console.error('Error during checkout:', err.message);
        res.status(500).json({ error: `Error during checkout: ${err.message}` });
    }
});

module.exports = router;

