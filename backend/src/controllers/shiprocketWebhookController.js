const Order = require('../models/Order');
const axios = require('axios');

exports.updateOrderStatus = async (req, res) => {
    try {
        const { order_id, current_status } = req.body;
        const token = req.headers['x-api-key'];
        if (token !== process.env.SHIPROCKET_WEBHOOK_SECRET) {
            console.log('Unauthorized');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const order = await Order.findOne({ shiprocketOrderId: order_id });
        if (order) {
            order.status = current_status;
            await order.save();
            res.json({ message: 'Shiprocket status updated' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// get access token from shiprocket
exports.getAccessToken = async (req, res) => {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: req.body.email,
            password: req.body.password
        });
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}