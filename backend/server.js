const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// CONEXIÓN A MONGODB ATLAS (CON TU CONTRASEÑA)
// ==========================================
const MONGODB_URI = 'mongodb+srv://simancadarley_db_user:5LBwm3ZIVfCrUUhT@cluster0.d7tkr6m.mongodb.net/merchglow?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('¡Conectado a MongoDB Atlas con éxito!'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// ==========================================
// MODELO DE PRODUCTO
// ==========================================
const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    imagen: String,
    categoria: String,
    subcategoria: String
});

const Producto = mongoose.model('Producto', productoSchema, 'productos');

// ==========================================
// RUTAS DE LA API
// ==========================================
app.get('/api/productos/categoria/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        const { sub } = req.query;

        let filtro = { categoria: categoria.toLowerCase() };
        
        if (sub) {
            filtro.subcategoria = sub.toLowerCase();
        }

        const productos = await Producto.find(filtro);
        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor de MerchGlow corriendo al 100% 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});