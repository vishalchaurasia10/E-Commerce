const ShippingPrice = require('../models/ShippingPrice');

exports.getShippingPrice = async (req, res) => {
    try {
        const shippingPrice = await ShippingPrice.findOne();
        res.json(shippingPrice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateShippingPrice = async (req, res) => {
    try {
        const { price } = req.body;
        const shippingPrice = await ShippingPrice.findOne();

        if (!shippingPrice) {
            const newShippingPrice = new ShippingPrice({ price });
            await newShippingPrice.save();
            return res.json(newShippingPrice);
        }

        shippingPrice.price = price;
        await shippingPrice.save();
        res.json(shippingPrice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}