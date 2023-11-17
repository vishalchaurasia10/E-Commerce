const express = require('express');
const router = express.Router();
const shippingPriceController = require('../controllers/shippingPriceController');

router.get('/', shippingPriceController.getShippingPrice);
router.put('/', shippingPriceController.updateShippingPrice);

module.exports = router;