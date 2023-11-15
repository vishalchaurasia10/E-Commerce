const PromoCode = require('../models/PromoCode');

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