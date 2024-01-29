const razorpayInstance = require('../middlewares/razorpay');
const Products = require('../models/Products'); // Import your Product model
const Order = require('../models/Order'); // Import your Order model
const AppliedPromoCode = require('../models/AppliedPromoCode'); // Import your AppliedPromoCode model
const crypto = require('crypto');
const axios = require('axios');
const ShippingPrice = require('../models/ShippingPrice');
const { sendOrderConfirmationEmail } = require('./emailController')

exports.checkout = async (req, res) => {
    try {
        const cartData = req.body.cart; // Assuming it's an array of objects with productId and quantity
        const discount = req.body.discount; // Assuming it's an object with amount and code
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

        const shippingPrice = await getShippingPrice();

        const options = {
            amount: (totalAmount - discount.amount + shippingPrice) * 100, // amount in smallest currency unit (assuming INR)
            currency: "INR",
        };

        const response = await razorpayInstance.orders.create(options);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.codCheckout = async (req, res) => {
    try {
        const cartData = req.body.cart; // Assuming it's an array of objects with productId and quantity
        const discount = req.body.discount; // Assuming it's an object with amount and code
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

        const shippingPrice = await getShippingPrice();

        const actualAmount = (totalAmount - discount.amount + shippingPrice) * 100;

        // const options = {
        //     amount: (totalAmount - discount.amount + shippingPrice) * 100, // amount in smallest currency unit (assuming INR)
        //     currency: "INR",
        // };

        if (req.body.discount.code.length > 0) {

            const appliedPromoCode = await AppliedPromoCode.findOne({ userId: req.body.userId });

            if (appliedPromoCode) {
                const promoCode = appliedPromoCode.appliedCodes.find(code => code.code === req.body.discount.code);
                if (promoCode) {
                    promoCode.usageCount += 1;
                } else {
                    appliedPromoCode.appliedCodes.push({ code: req.body.discount.code, usageCount: 1 });
                }
                await appliedPromoCode.save();
            } else {
                const appliedPromoCode = new AppliedPromoCode({
                    userId: req.body.userId,
                    appliedCodes: [{ code: req.body.discount.code, usageCount: 1 }],
                });
                await appliedPromoCode.save();
            }
        }

        const orderItems = req.body.cart.map(item => ({
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            _id: item.productId // Use the productId as the _id
        }));

        const order = new Order({
            user: req.body.userId,
            paidAmount: 0,
            amountToBePaid: actualAmount,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            products: orderItems,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            pinCode: req.body.pinCode,
            phoneNumber: req.body.phoneNumber,
            discount: req.body.discount.amount,
            paymentMode: "COD",
        });

        const createdOrder = await order.save();

        const accessToken = await getShiprocketAccessToken();
        const shiprocketOrder = await mapOrderToShiprocketFormat(createdOrder, "COD");

        const shiprocketDetails = await createShiprocketOrder(accessToken, shiprocketOrder);

        const updatedOrder = await Order.findByIdAndUpdate(
            createdOrder._id,
            { $set: { shiprocketOrderId: shiprocketDetails.order_id, shiprocketShipmentId: shiprocketDetails.shipment_id } },
            { new: true }
        );

        const orderDetails = {
            customerName: updatedOrder.firstName + " " + updatedOrder.lastName,
            customerEmail: updatedOrder.email,
            customerPhone: updatedOrder.phoneNumber,
            orderNumber: updatedOrder.shiprocketOrderId,
            totalPrice: updatedOrder.amountToBePaid / 100,
            adminOrderId: createdOrder._id
            // products: req.body.cart,
        };

        await sendOrderConfirmationEmail(orderDetails);

        res.status(200).json({ status: "Success", message: "Order placed successfully" });
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

        if (req.body.discount.code.length > 0) {

            const appliedPromoCode = await AppliedPromoCode.findOne({ userId: req.body.userId });

            if (appliedPromoCode) {
                const promoCode = appliedPromoCode.appliedCodes.find(code => code.code === req.body.discount.code);
                if (promoCode) {
                    promoCode.usageCount += 1;
                } else {
                    appliedPromoCode.appliedCodes.push({ code: req.body.discount.code, usageCount: 1 });
                }
                await appliedPromoCode.save();
            } else {
                const appliedPromoCode = new AppliedPromoCode({
                    userId: req.body.userId,
                    appliedCodes: [{ code: req.body.discount.code, usageCount: 1 }],
                });
                await appliedPromoCode.save();
            }
        }

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
                amountToBePaid: 0,
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
                discount: req.body.discount.amount,
                paymentMode: "PREPAID",
            });

            const createdOrder = await order.save();

            const accessToken = await getShiprocketAccessToken();
            const shiprocketOrder = await mapOrderToShiprocketFormat(createdOrder, "PREPAID");

            const shiprocketDetails = await createShiprocketOrder(accessToken, shiprocketOrder);

            const updatedOrder = await Order.findByIdAndUpdate(
                createdOrder._id,
                { $set: { shiprocketOrderId: shiprocketDetails.order_id, shiprocketShipmentId: shiprocketDetails.shipment_id } },
                { new: true }
            );

            const orderDetails = {
                customerName: updatedOrder.firstName + " " + updatedOrder.lastName,
                customerEmail: updatedOrder.email,
                customerPhone: updatedOrder.phoneNumber,
                orderNumber: updatedOrder.shiprocketOrderId,
                totalPrice: updatedOrder.paidAmount / 100,
                adminOrderId: createdOrder._id
                // products: req.body.cart,
            };

            await sendOrderConfirmationEmail(orderDetails);

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

async function mapOrderToShiprocketFormat(createdOrder, paymentMode) {
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
        payment_method: paymentMode,
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: paymentMode === "COD" ? createdOrder.amountToBePaid / 100 : createdOrder.paidAmount / 100,
        length: 29.0,
        breadth: 18.0,
        height: 4.0,
        weight: 0.1 * totalQuantity,
    }
}

async function getShippingPrice() {
    try {
        const shippingPrice = await ShippingPrice.findOne();
        return shippingPrice.price
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}