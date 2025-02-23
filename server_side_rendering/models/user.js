const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
});

module.exports = mongoose.model('user', userSchema);