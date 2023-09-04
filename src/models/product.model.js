const mongoose = require('mongoose');
const productCollection = "products";

const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    imagen: { type: String, required: true }
})

const productModel = mongoose.model(productCollection, productSchema);

module.exports = { productModel };