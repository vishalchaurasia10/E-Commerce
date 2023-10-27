const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    imageId: {
        type: [String],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: [String],
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    otherDetails: {
        type: [String],
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;