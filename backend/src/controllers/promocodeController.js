const PromoCode = require('../models/PromoCode');
const AppliedPromoCode = require('../models/AppliedPromoCode');

// Create a new promo code
exports.createPromoCode = async (req, res) => {
    try {
        const promoCode = new PromoCode(req.body);
        const savedPromoCode = await promoCode.save();
        res.status(201).json(savedPromoCode);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get promo codes with pagination
exports.getPromoCodesByPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
    const perPage = 12; // Number of promo codes per page

    try {
        const totalPromoCodes = await PromoCode.countDocuments();
        const totalPages = Math.ceil(totalPromoCodes / perPage);

        if (page < 1 || page > totalPages) {
            return res.status(400).json({ message: 'Invalid page number' });
        }

        const promoCodes = await PromoCode.find()
            .skip((page - 1) * perPage) // Skip promo codes on previous pages
            .limit(perPage); // Limit to perPage promo codes

        res.status(200).json({ promoCodes, totalPages, currentPage: page });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// accepts the cart and promo code as parameters and returns the dicount amount
exports.calculateDiscount = async (req, res) => {
    try {
        const { cart, promoCode } = req.body;

        //get productids and quantities from cart which is an array of objects
        const items = cart.map(item => {
            return {
                quantity: item.quantity,
                price: item.product.price,
            };
        });

        if (!req.body.userId) {
            return res.status(400).json({ discount: 0, error: 'Please login first' });
        }

        const promoCodeDocument = await PromoCode.findOne({ code: promoCode });
        const userAppliedPromoCodes = await AppliedPromoCode.findOne({ userId: req.body.userId });

        // If the promo code is not found, return 0 discount
        if (!promoCodeDocument) {
            return res.status(200).json({ discount: 0, error: 'Invalid promo code' });
        }

        if (promoCodeDocument.times !== 'multiple') {
            if (userAppliedPromoCodes) {
                const promoCodeAlreadyApplied = userAppliedPromoCodes.appliedCodes.find(code => code.code === promoCode);

                // check the usage with the number of times the code can be applied
                if (promoCodeAlreadyApplied && promoCodeAlreadyApplied.usageCount >= promoCodeDocument.times) {
                    return res.status(200).json({ discount: 0, error: 'Promo code usage limit exceeded' });
                }
            }
        }

        const { discountPercent, discountAmount, expiryDate, minimumAmount, maximumDiscount } = promoCodeDocument;

        // If the promo code is not found, return 0 discount
        if (!discountPercent && !discountAmount) {
            return res.status(200).json({ discount: 0, error: 'Invalid promo code' });
        }

        // If the promo code is expired, return 0 discount
        if (expiryDate < Date.now()) {
            return res.status(200).json({ discount: 0, error: 'Promo code expired' });
        }

        // Calculate total price of all items in cart
        const totalPrice = items.reduce((total, item) => {
            return total + (item.quantity * item.price);
        }, 0);

        // If the total price is less than the minimum amount, return 0 discount
        if (totalPrice < minimumAmount) {
            return res.status(200).json({ discount: 0, error: `Add ₹${minimumAmount - totalPrice} items more` });
        }

        // If the discount amount is specified, return it
        if (discountAmount) {
            return res.status(200).json({ discount: discountAmount, message: 'Discount applied' });
        }

        // Calculate discount based on discount percent
        const discount = totalPrice * (discountPercent / 100);

        // If the maximum discount is specified and the calculated discount exceeds it, return the maximum discount
        if (maximumDiscount && discount > maximumDiscount) {
            return res.status(200).json({ discount: maximumDiscount, message: 'Discount applied' });
        }

        // Otherwise, return the calculated discount
        res.status(200).json({ discount, message: 'Discount applied' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// delete a promo code
exports.deletePromoCode = async (req, res) => {
    try {
        const deletedPromoCode = await PromoCode.findByIdAndDelete(req.params.id);
        if (!deletedPromoCode) {
            return res.status(404).json({ error: 'Promo code not found' });
        }
        res.status(200).json({ message: 'Promo code deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// update a promo code
exports.updatePromoCode = async (req, res) => {
    try {
        const updatedPromoCode = await PromoCode.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPromoCode) {
            return res.status(404).json({ error: 'Promo code not found' });
        }
        res.status(200).json({ message: 'Promo code updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}