const razorpayInstance = require('../middlewares/razorpay');
const Products = require('../models/Products'); // Import your Product model
const Order = require('../models/Order'); // Import your Order model
const crypto = require('crypto');
const axios = require('axios');

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
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature === razorpay_signature) {
            const orderItems = req.body.cart.map(item => ({
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                _id: item.productId // Use the productId as the _id
            }));

            const order = new Order({
                user: req.body.userId,
                paidAmount: req.body.paidAmount,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                products: orderItems,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                address: req.body.address,
                state: req.body.state,
                city: req.body.city,
                pinCode: req.body.pinCode,
                phoneNumber: req.body.phoneNumber,
            });

            const createdOrder = await order.save();

            const accessToken = await getShiprocketAccessToken();
            const shiprocketOrder = await mapOrderToShiprocketFormat(createdOrder);

            const shiprocketDetails = await createShiprocketOrder(accessToken, shiprocketOrder);

            await Order.findByIdAndUpdate(
                createdOrder._id,
                { $set: { shiprocketOrderId: shiprocketDetails.order_id, shiprocketShipmentId: shiprocketDetails.shipment_id } },
                { new: true }
            );

            res.status(200).json({ status: "Success", message: "Order placed successfully" });
        } else {
            res.status(400).json({ status: "Failure", message: "Order Verification Failed" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function createShiprocketOrder(shiprocketAccessToken, shiprocketOrder) {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', shiprocketOrder, {
            headers: {
                Authorization: `Bearer ${shiprocketAccessToken}`,
            },
        });
        console.log("Shiprocket Order Created:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error creating Shiprocket order:", error.response ? error.response.data : error.message);
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

async function mapOrderToShiprocketFormat(createdOrder) {
    const productIds = createdOrder.products.map(item => item._id);
    // Fetch product details from the database for the product IDs in the cart
    const products = await Products.find({ _id: { $in: productIds } });

    const priceMap = new Map();
    const titleMap = new Map();

    products.forEach(product => {
        priceMap.set(product._id.toString(), product.price);
    });

    products.forEach(product => {
        titleMap.set(product._id.toString(), product.title);
    });

    //calculate total quantity
    let totalQuantity = 0;
    createdOrder.products.forEach(item => {
        totalQuantity += item.quantity;
    });

    return {
        order_id: createdOrder._id,
        order_date: createdOrder.createdAt,
        phone_verified: 1,
        id: createdOrder.orderId,
        pickup_location: "Forever TrendIn",
        address: "H no 336, beside Mohini Apartment, Goushala Road",
        address_2: "Near Jain Mandir, Jugsalai",
        city: "East Singhbhum",
        email: "forevertrendin1429@gmail.com",
        phone: "9341643917",
        seller_name: "Forever TrendIn",
        state: "Jharkhand",
        country: "India",
        status: 2,
        pin_code: "831006",
        lat: "",
        long: "",
        warehouse_code: null,
        channel_id: "",
        comment: "Reseller: M/s Goku",
        billing_customer_name: createdOrder.firstName,
        billing_last_name: createdOrder.lastName,
        billing_address: createdOrder.address,
        billing_address_2: "",
        billing_city: createdOrder.city,
        billing_pincode: createdOrder.pinCode,
        billing_state: createdOrder.state,
        billing_country: "India",
        billing_email: createdOrder.email,
        billing_phone: createdOrder.phoneNumber,
        shipping_is_billing: true,
        shipping_customer_name: "",
        shipping_last_name: "",
        shipping_address: "",
        shipping_address_2: "",
        shipping_city: "",
        shipping_pincode: "",
        shipping_country: "",
        shipping_state: "",
        shipping_email: "",
        shipping_phone: "",
        order_items: createdOrder.products.map(item => ({
            name: titleMap.get(item._id.toString()),
            sku: `${item._id}_${item.size}_${item.color}`,
            units: item.quantity,
            discount: 0,
            tax: 0,
            hsn: 0,
            selling_price: priceMap.get(item._id.toString()),
            color: item.color,
            size: item.size,
        })),
        payment_method: "Prepaid",
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: createdOrder.paidAmount / 100,
        length: 0.5,
        breadth: 0.5,
        height: 0.5,
        weight: 0.1 * totalQuantity,
    }
}