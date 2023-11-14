const razorpayInstance = require('../middlewares/razorpay');
const Products = require('../models/Products'); // Import your Product model
const Order = require('../models/Order'); // Import your Order model
const crypto = require('crypto');

exports.checkout = async (req, res) => {
    try {
        const cartData = req.body.cart; // Assuming it's an array of objects with productId and quantity
        const productIds = cartData.map(item => item.productId);

        // Fetch product details from the database for the product IDs in the cart
        const products = await Products.find({ _id: { $in: productIds } });

        // Create a map to store quantities based on _id
        const quantityMap = new Map();
        cartData.forEach(item => {
            const productIdString = item.productId;
            if (quantityMap.has(productIdString)) {
                quantityMap.set(productIdString, quantityMap.get(productIdString) + item.quantity);
            } else {
                quantityMap.set(productIdString, item.quantity);
            }
        });

        // Calculate the total amount based on the product prices and aggregated quantities
        const totalAmount = products.reduce((total, product) => {
            const productIdString = product._id.toString();
            const cartQuantity = quantityMap.get(productIdString) || 0;
            const itemPrice = product.price; // You may need to adjust this based on your database schema
            total += itemPrice * cartQuantity;
            return total;
        }, 0);

        const options = {
            amount: totalAmount * 100, // amount in smallest currency unit (assuming INR)
            currency: "INR",
        };

        const response = await razorpayInstance.orders.create(options);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.verifyTransaction = async (req, res) => {
    try {
        console.log(req.body);
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature === razorpay_signature) {
            const order = new Order({
                user: req.body.userId,
                products: req.body.cart,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber
            });
            await order.save();
            res.status(200).json({ status: "Success", message: "Order placed successfully" });
        } else {
            res.status(400).json({ status: "Failure", message: "Order Verification Failed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
