const express = require('express');
const router = express.Router();

const shiprocketWebhooks = require('../controllers/shiprocketWebhookController');

router.post('/', shiprocketWebhooks.updateOrderStatus);

router.post('/access-token', shiprocketWebhooks.getAccessToken);

module.exports = router;