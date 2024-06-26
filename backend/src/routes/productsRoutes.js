const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const multer = require('multer');

// Define multer storage configuration for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffers

const upload = multer({ storage });

// Create a new product
router.post('/', productsController.createProduct);

// Get all products
router.get('/', productsController.getAllProducts);

// Get products with pagination
router.get('/page', productsController.getProductsByPage);

router.get('/featured', productsController.getFeaturedProducts)

router.get('/range', productsController.getProductsByPriceRange)

// Search products
router.get('/search', productsController.searchProducts);

// search products by categoryId
router.get('/category/:categoryId', productsController.getProductsByCategory);

// Get a single product by ID
router.get('/:productId', productsController.getProductById);

router.get('/type/:type', productsController.getProductsByType);

// Update a product by ID
router.put('/:productId', upload.array('files'), productsController.updateProduct);

// Delete a product by ID
router.delete('/:productId', productsController.deleteProduct);

// Handle file upload
router.post('/upload', upload.array('files'), productsController.uploadProductImages);

module.exports = router;