const mongoose = require('mongoose');
const userCollection = "users";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true }
})

const userModel = mongoose.model(userCollection, userSchema);

module.exports = { userModel };