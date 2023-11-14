const Order = require('../models/Order');
const Products = require('../models/Products');
const User = require('../models/User');

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
