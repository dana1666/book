
// const express = require('express');
// const multer = require('multer');
// const bookController = require('../controllers/bookController');  


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');  
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);  
//     }
// });
// const upload = multer({ storage: storage });

// module.exports = function(io) {  
//     const router = express.Router();

//     // Route for adding a new book (for writers)
//     router.post('/', upload.single('bookImage'), (req, res) => bookController.addBook(req, res, io));

//     // Route to get all approved books (for buyers)
//     router.get('/', (req, res) => bookController.getApprovedBooks(req, res));

//     // Route to get all books by a specific writer (for writers to view their books)
//     router.get('/writer/:writerId', (req, res) => bookController.getBooksByWriter(req, res));

//     // Route to get a single book by ID, including its stock quantity (for book details)
//     router.get('/:bookId', (req, res) => bookController.getBookById(req, res));

//     // Route to edit a book by its ID (for writers to edit their books)
//     router.put('/:bookId', (req, res) => bookController.updateBook(req, res));

//     return router;
// };
//--------

// const express = require('express');
// const multer = require('multer');
// const bookController = require('../controllers/bookController');

// // Set up Multer for handling file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');  // Directory for image uploads
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);  // Add timestamp to avoid filename conflicts
//     }
// });
// const upload = multer({ storage: storage });

// module.exports = function(io) {
//     const router = express.Router();

//     // Route for adding a new book (for writers)
//     router.post('/', upload.single('bookImage'), async (req, res) => {
//         try {
//             await bookController.addBook(req, res, io);  // Pass io instance to controller
//         } catch (err) {
//             res.status(500).send('Error adding book: ' + err.message);
//         }
//     });

//     // Route to get all approved books (for buyers)
//     router.get('/', async (req, res) => {
//         try {
//             await bookController.getApprovedBooks(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching approved books: ' + err.message);
//         }
//     });

//     // Route to get all books by a specific writer (for writers to view their books)
//     router.get('/writer/:writerId', async (req, res) => {
//         try {
//             await bookController.getBooksByWriter(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching books for writer: ' + err.message);
//         }
//     });

//     // Route to get a single book by ID, including its stock quantity (for book details)
//     router.get('/:bookId', async (req, res) => {
//         try {
//             await bookController.getBookById(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching book details: ' + err.message);
//         }
//     });

//     // Route to edit a book by its ID (for writers to edit their books)
//     router.put('/:bookId', async (req, res) => {
//         try {
//             await bookController.updateBook(req, res);
//         } catch (err) {
//             res.status(500).send('Error updating book: ' + err.message);
//         }
//     });

//     return router;
// };
//=====

// const express = require('express');
// const multer = require('multer');
// const bookController = require('../controllers/bookController');

// const router = express.Router();

// // Set up Multer for handling file uploads (e.g., book cover image)
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');  // Directory for image uploads
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);  // Add timestamp to avoid filename conflicts
//     }
// });
// const upload = multer({ storage: storage });

// module.exports = function(io) {
//     // Route for adding a new book (for writers)
//     router.post('/', upload.single('bookImage'), async (req, res) => {
//         try {
//             await bookController.addBook(req, res, io);  // Pass io instance to controller
//         } catch (err) {
//             res.status(500).send('Error adding book: ' + err.message);
//         }
//     });

//     // Route to get all approved books (for buyers)
//     router.get('/', async (req, res) => {
//         try {
//             await bookController.getApprovedBooks(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching approved books: ' + err.message);
//         }
//     });

//     // Route to get all books by a specific writer (for writers to view their books)
//     router.get('/writer/:writerId', async (req, res) => {
//         try {
//             await bookController.getBooksByWriter(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching books for writer: ' + err.message);
//         }
//     });

//     // Route to get a single book by ID, including its stock quantity (for book details)
//     router.get('/:bookId', async (req, res) => {
//         try {
//             await bookController.getBookById(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching book details: ' + err.message);
//         }
//     });

//     // Route to edit a book by its ID (for writers to edit their books)
//     router.put('/:bookId', async (req, res) => {
//         try {
//             await bookController.updateBook(req, res);
//         } catch (err) {
//             res.status(500).send('Error updating book: ' + err.message);
//         }
//     });

//     return router;
// };
//===

// const express = require('express');
// const multer = require('multer');
// const bookController = require('../controllers/bookController');
// const router = express.Router();

// // Set up Multer for handling file uploads (e.g., book cover image)
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');  // Directory for image uploads
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);  // Add timestamp to avoid filename conflicts
//     }
// });
// const upload = multer({ storage: storage });

// module.exports = function(io) {
//     // Route for adding a new book (for writers)
//     router.post('/', upload.single('bookImage'), async (req, res) => {
//         try {
//             await bookController.addBook(req, res, io);  // Pass io instance to controller
//         } catch (err) {
//             res.status(500).send('Error adding book: ' + err.message);
//         }
//     });

//     // Route to get all approved books (for buyers)
//     router.get('/', async (req, res) => {
//         try {
//             await bookController.getApprovedBooks(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching approved books: ' + err.message);
//         }
//     });

//     // Route to get all books by a specific writer (for writers to view their books)
//     router.get('/writer/:writerId', async (req, res) => {
//         try {
//             await bookController.getBooksByWriter(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching books for writer: ' + err.message);
//         }
//     });

//     // Route to get a single book by ID, including its stock quantity (for book details)
//     router.get('/:bookId', async (req, res) => {
//         try {
//             await bookController.getBookById(req, res);
//         } catch (err) {
//             res.status(500).send('Error fetching book details: ' + err.message);
//         }
//     });

//     // Route to edit a book by its ID (for writers to edit their books)
//     router.put('/:bookId', async (req, res) => {
//         try {
//             await bookController.updateBook(req, res);
//         } catch (err) {
//             res.status(500).send('Error updating book: ' + err.message);
//         }
//     });

//     return router;
// };
//-----------------


const express = require('express');
const multer = require('multer');
const bookController = require('../controllers/bookController');
const router = express.Router();

// Set up Multer for handling file uploads (e.g., book cover image)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directory for image uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Add timestamp to avoid filename conflicts
    }
});
const upload = multer({ storage: storage });

module.exports = function(io) {
    // Route for adding a new book (for writers)
    router.post('/', upload.single('bookImage'), async (req, res) => {
        try {
            await bookController.addBook(req, res, io);  // Pass io instance to controller
        } catch (err) {
            res.status(500).send('Error adding book: ' + err.message);
        }
    });

    // Route to get all approved books (for buyers)
    router.get('/', async (req, res) => {
        try {
            await bookController.getApprovedBooks(req, res);
        } catch (err) {
            res.status(500).send('Error fetching approved books: ' + err.message);
        }
    });

    // Route to get all books by a specific writer (for writers to view their books)
    router.get('/writer/:writerId', async (req, res) => {
        try {
            await bookController.getBooksByWriter(req, res);
        } catch (err) {
            res.status(500).send('Error fetching books for writer: ' + err.message);
        }
    });

    // Route to get a single book by ID, including its stock quantity (for book details)
    router.get('/:bookId', async (req, res) => {
        try {
            await bookController.getBookById(req, res);
        } catch (err) {
            res.status(500).send('Error fetching book details: ' + err.message);
        }
    });

    // Route to edit a book by its ID (for writers to edit their books)
    router.put('/:bookId', async (req, res) => {
        try {
            await bookController.updateBook(req, res);
        } catch (err) {
            res.status(500).send('Error updating book: ' + err.message);
        }
    });

    return router;
};

