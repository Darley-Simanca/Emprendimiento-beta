const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbFile = path.join(__dirname, 'database.json');

// Función auxiliar para leer la base de datos local
function leerDB() {
    if (!fs.existsSync(dbFile)) {
        // Datos iniciales por defecto si no existe el archivo
        const datosIniciales = [
            { id: 1, nombre: "Gaara", categoria: "anime", precio: 26000, imagen: "img/gaaraproducts.jpg" },
            { id: 2, nombre: "Damian Wayne", categoria: "dc", precio: 39000, imagen: "img/damibtw.webp" },
            { id: 3, nombre: "SpiderMan", categoria: "marvel", precio: 27000, imagen: "img/spiderman.jpg" }
        ];
        fs.writeFileSync(dbFile, JSON.stringify(datosIniciales, null, 2));
    }
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
}

// RUTA GET: Obtener productos
app.get('/api/productos', (req, res) => {
    const productos = leerDB();
    res.json(productos);
});

// RUTA POST: Guardar un nuevo producto (Ideal para el Panel Admin)
app.post('/api/productos', (req, res) => {
    const productos = leerDB();
    const nuevoProducto = { id: Date.now(), ...req.body };
    productos.push(nuevoProducto);
    fs.writeFileSync(dbFile, JSON.stringify(productos, null, 2));
    res.status(201).json(nuevoProducto);
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo con éxito en http://localhost:${PORT}`);
});