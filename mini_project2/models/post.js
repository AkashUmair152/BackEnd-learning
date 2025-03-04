const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        default: [],
    },
    image: { type: String }, // Optional field for storing the image URL
});

module.exports = mongoose.model('post', postSchema);