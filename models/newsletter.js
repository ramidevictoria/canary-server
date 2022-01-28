const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsletterSchema = new Schema({
    email: String,
    unique: true
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);