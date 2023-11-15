const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    discountPercent: {
        type: Number,
    },
    discountAmount: {
        type: Number,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    minimumAmount: {
        type: Number,
        required: true,
    },
    maximumDiscount: {
        type: Number,
    },
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;