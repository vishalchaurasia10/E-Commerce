const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

// Define routes
router.post('/', emailController.sendEmail);

module.exports = router;