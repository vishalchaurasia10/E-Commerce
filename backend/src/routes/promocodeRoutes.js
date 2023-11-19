const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promocodeController');

// Create a new promo code
router.post('/', promoCodeController.createPromoCode);

// Get promo codes with pagination
router.get('/page', promoCodeController.getPromoCodesByPage);

// Calculate discount
router.post('/calculate', promoCodeController.calculateDiscount);

// delete promo code
router.delete('/:id', promoCodeController.deletePromoCode);

// update promo code
router.put('/:id', promoCodeController.updatePromoCode);

module.exports = router;