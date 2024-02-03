const express = require('express');
const router = express.Router();

const shiprocketWebhooks = require('../controllers/shiprocketWebhookController');

router.post('/', shiprocketWebhooks.updateOrderStatus);

router.post('/get-tracking-details/:shipmentId', shiprocketWebhooks.getTrackingDetails);

module.exports = router;