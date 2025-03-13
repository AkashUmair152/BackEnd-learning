const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: {
        type: String,
        required: true
    },
    textcolor: {
        type: String,
        required: true
    },
    panelcolor: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;