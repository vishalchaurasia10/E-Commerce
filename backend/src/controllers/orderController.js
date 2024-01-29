const Order = require('../models/Order');
const Products = require('../models/Products');
const User = require('../models/User');
const razorpayInstance = require('../middlewares/razorpay');
const axios = require('axios');

// Fetch all the orders in reverse order of creation for a particular user
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.body.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
}

// fetch a particular order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
}

// cancel a particular order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order.status === 'Canceled') {
            return res.status(400).json({ error: 'Order already cancelled' });
        }
        if (order.status !== 'confirmed') {
            return res.status(400).json({ error: 'Order cannot be cancelled' });
        }
        if (order.paymentMode === 'PREPAID') {
            const response = razorpayInstance.payments.refund(order.paymentId, {
                amount: order.paidAmount,
                speed: 'normal'
            });
            const razorpayRefundResponse = await response;
            order.refundId = razorpayRefundResponse.id;
        }
        order.status = 'Canceled';

        // cancel the order on shiprocket as well
        const accessToken = await getShiprocketAccessToken();
        await cancelShiprocketOrder(accessToken, order.shiprocketOrderId);

        await order.save();
        res.status(200).json({ status: 'Success', message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error cancelling order' });
    }
}

async function cancelShiprocketOrder(shiprocketAccessToken, shiprocketOrderId) {
    try {
        const data = {
            ids: [shiprocketOrderId]
        };
        const response = await axios.post(`https://apiv2.shiprocket.in/v1/external/orders/cancel`, data, {
            headers: {
                Authorization: `Bearer ${shiprocketAccessToken}`,
            },
        });
    } catch (error) {
        console.error("Error cancelling Shiprocket order:", error.response ? error.response.data : error.message);
    }
}

async function getShiprocketAccessToken() {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        });
        return response.data.token;
    } catch (error) {
        console.error("Error getting Shiprocket access token:", error.response ? error.response.data : error.message);
    }
}
