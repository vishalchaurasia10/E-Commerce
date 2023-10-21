const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;