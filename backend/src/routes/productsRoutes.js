const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const uploadMultipleMiddleware = require('../middlewares/uploadMultipleMiddleware');

// Create a new product
router.post('/', productsController.createProduct);

// Get all products
router.get('/', productsController.getAllProducts);

router.get('/featured', productsController.getFeaturedProducts)

// Get a single product by ID
router.get('/:type', productsController.getProductsByType);

// Update a product by ID
router.put('/:productId', productsController.updateProduct);

// Delete a product by ID
router.delete('/:productId', productsController.deleteProduct);

// Handle file upload
router.post('/upload', uploadMultipleMiddleware.array('files'), productsController.uploadProductImages);

module.exports = router;