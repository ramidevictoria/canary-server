const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String,
    avatar: String,
    active: {type:Boolean, default: false}
});

module.exports = mongoose.model('User', UserSchema);