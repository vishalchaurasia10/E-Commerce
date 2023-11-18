const express = require('express');
const router = express.Router();

const shiprocketWebhooks = require('../controllers/shiprocketWebhookController');

router.post('/', shiprocketWebhooks.updateOrderStatus);

module.exports = router;