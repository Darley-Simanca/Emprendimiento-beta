const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Conexión a MongoDB Atlas 
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://simancadarley_db_user:5LBwm3ZIVfCrUUhT@cluster0.d7tkr6m.mongodb.net/merchglow";

mongoose.connect(MONGO_URI)
  .then(() => console.log("¡Conectado a MongoDB Atlas con éxito!"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));

// 2. Definir el Esquema y Modelo de Producto
const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    categoria: String,
    subcategoria: String,
    imagen: String,
    precioOriginal: Number,
    descuento: String
});

const Producto = mongoose.model('Producto', productoSchema, 'productos'); // 'productos' es tu colección en MongoDB

// 3. NUEVA RUTA: Obtener TODOS los productos (Para la página principal / MerchGlow.html)
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener todos los productos" });
    }
});

// 4. Ruta para obtener productos por categoría (ej: /api/productos/categoria/anime)
app.get('/api/productos/categoria/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        const { sub } = req.query;

        // Filtro base: busca por categoría (ej. "anime")
        let filtro = { 
            categoria: { $regex: new RegExp(`^${categoria}$`, 'i') } 
        };

        // Si el usuario seleccionó una subcategoría (ej. "naruto"), agrega el filtro
        if (sub && sub.trim() !== "") {
            filtro.subcategoria = { $regex: new RegExp(`^${sub}$`, 'i') };
        }

        const productos = await Producto.find(filtro);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});