const moongose = require('mongoose');

const shippingPriceSchema = new moongose.Schema({
    price: {
        type: Number,
        required: true
    },
});

const ShippingPrice = moongose.model('ShippingPrice', shippingPriceSchema);

module.exports = ShippingPrice;