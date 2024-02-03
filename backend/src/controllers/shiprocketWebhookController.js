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

const getAccessToken = async () => {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        });
        return response.data.token;
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.getTrackingDetails = async (req, res) => {
    try {
        const token = await getAccessToken();
        console.log(req.params.shipmentId, token)
        if (!token) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${req.params.shipmentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}