const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promocodeController');

// Create a new promo code
router.post('/', promoCodeController.createPromoCode);

// Get promo codes with pagination
router.get('/', promoCodeController.getPromoCodesByPage);

// Calculate discount
router.post('/calculate', promoCodeController.calculateDiscount);

module.exports = router;