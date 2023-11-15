const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.getOrders);

router.get('/:id', orderController.getOrder);

router.post('/cancel/:id', orderController.cancelOrder);

module.exports = router;