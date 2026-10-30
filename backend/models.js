const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    precioAnterior: { type: Number },
    imagen: { type: String, required: true },
    descuento: { type: String }
});

module.exports = mongoose.model('Producto', productoSchema);