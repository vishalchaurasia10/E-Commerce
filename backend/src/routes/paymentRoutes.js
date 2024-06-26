const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/checkout', paymentController.checkout);

router.post('/callback', paymentController.verifyTransaction);

router.post('/cod', paymentController.codCheckout);

module.exports = router;