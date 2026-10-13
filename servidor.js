
// ==========================================================
// PRÁCTICA · MINI API DE CAFÉ ANDINO
// JÓVENES creaTIvos 2026 — SESIÓN 19
//
// TEMA: Mongoose, esquemas, validaciones y CRUD con Express
//
// OBJETIVOS:
// 1. Crear un servidor con Express.
// 2. Conectar nuestra aplicación con MongoDB Atlas.
// 3. Utilizar modelos de Mongoose.
// 4. Aplicar validaciones a los datos.
// 5. Implementar GET, POST, PUT y DELETE.
// 6. Comprobar que los datos permanecen guardados.
// ==========================================================


// ==========================================================
// PASO 1 · IMPORTACIÓN DE LIBRERÍAS
// ==========================================================

// Carga las variables de entorno desde el archivo .env.
require('dotenv').config();

// Express permite crear nuestro servidor y definir rutas HTTP.
const express = require('express');

// Mongoose permite conectarnos y trabajar con MongoDB.
const mongoose = require('mongoose');

// fs permite leer archivos del sistema.
const fs = require('fs');

// path permite construir rutas de archivos.
const path = require('path');

// Importamos el modelo Usuario.
// Este modelo define la estructura y las validaciones
// de los documentos que guardaremos en MongoDB.
const Usuario = require('./models/Usuario');


// ==========================================================
// PASO 2 · CONFIGURACIÓN DEL SERVIDOR EXPRESS
// ==========================================================

// Creamos nuestra aplicación Express.
const app = express();

// Middleware para interpretar datos JSON enviados
// desde Thunder Client, Postman u otras aplicaciones.
//
// Sin express.json(), req.body no contendría correctamente
// el JSON que enviamos en las peticiones.
app.use(express.json());

// Permite acceder a archivos estáticos de la carpeta public,
// como estilos.css.
app.use(express.static(path.join(__dirname, 'public')));


// ==========================================================
// PASO 3 · DATOS EN MEMORIA
// REPASO DE LA SESIÓN ANTERIOR
// ==========================================================

// Estos productos están guardados en un array de JavaScript.
//
// IMPORTANTE:
// Los datos agregados a un array durante la ejecución
// se pierden cuando reiniciamos el servidor.
//
// Hoy aprenderemos a utilizar MongoDB para almacenar
// información de manera permanente.

const productos = [
  {
    id: 1,
    nombre: 'Café Andino',
    precio: 3.5,
    descripcion: 'Café de altura, tostado suave',
    emoji: '☕'
  },
  {
    id: 2,
    nombre: 'Capuchino',
    precio: 4,
    descripcion: 'Espresso con leche vaporizada',
    emoji: '🥛'
  },
  {
    id: 3,
    nombre: 'Brownie',
    precio: 2.5,
    descripcion: 'Brownie de chocolate casero',
    emoji: '🍫'
  },
  {
    id: 4,
    nombre: 'Té Chai',
    precio: 3,
    descripcion: 'Té especiado con leche',
    emoji: '🍵'
  }
];


// ==========================================================
// PASO 4 · FUNCIONES PARA MOSTRAR HTML
// ==========================================================

// Leemos nuestra plantilla HTML.
const plantilla = fs.readFileSync(
  path.join(__dirname, 'plantilla.html'),
  'utf8'
);

// Evitamos que ciertos caracteres se interpreten como HTML.
const escapar = (valor) =>
  String(valor).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

// Reemplazamos los marcadores de la plantilla
// por el título y el contenido de cada página.
const renderizar = (titulo, contenido) =>
  plantilla
    .replace('{{TITULO}}', escapar(titulo))
    .replace('{{CONTENIDO}}', contenido);

// Función auxiliar para responder con una página HTML.
const pagina = (res, titulo, contenido, estado = 200) =>
  res.status(estado)
    .type('html')
    .send(renderizar(titulo, contenido));


// ==========================================================
// PASO 5 · RUTAS DE NUESTRA PÁGINA WEB
// ==========================================================

// GET /
// Muestra la página principal.
app.get('/', (req, res) => {
  pagina(
    res,
    'Inicio',
    `<div class="card">
      <h2>Bienvenido a Café Andino</h2>
      <p>
        Café de altura, postres caseros y buena compañía.
        Visita <a href="/catalogo">nuestro catálogo</a>
        o prueba la API de usuarios.
      </p>
    </div>`
  );
});

// GET /nosotros
// Muestra información del emprendimiento.
app.get('/nosotros', (req, res) => {
  pagina(
    res,
    'Nosotros',
    `<div class="card">
      <h2>Nuestra historia</h2>
      <p>
        Somos un emprendimiento familiar desde 2024,
        tostando café de altura ecuatoriano.
      </p>
    </div>`
  );
});

// GET /contacto
// Muestra la información de contacto.
app.get('/contacto', (req, res) => {
  pagina(
    res,
    'Contacto',
    `<div class="card">
      <h2>Contacto</h2>
      <p>Escríbenos a hola@cafeandino.com</p>
    </div>`
  );
});

// GET /catalogo
// Genera una lista HTML utilizando nuestro array.
app.get('/catalogo', (req, res) => {

  // map() transforma cada producto en un elemento HTML.
  const filas = productos.map(p => `
    <li>
      <div class="item-row">
        <span class="emoji">${p.emoji}</span>
        <div>
          <div class="nombre">
            <a href="/item?id=${p.id}">
              ${escapar(p.nombre)}
            </a>
          </div>
          <div class="desc">${escapar(p.descripcion)}</div>
        </div>
      </div>
      <span class="precio">$${p.precio.toFixed(2)}</span>
    </li>
  `).join('');

  pagina(
    res,
    'Catálogo',
    `<div class="card">
      <h2>Nuestro catálogo</h2>
      <ul class="catalogo">${filas}</ul>
    </div>`
  );
});

// GET /item?id=1
// Busca un producto utilizando un parámetro de consulta.
app.get('/item', (req, res) => {

  // req.query.id obtiene el valor enviado en la URL.
  const idBuscado = Number(req.query.id);

  // find() busca un producto dentro del array.
  const producto = productos.find(p => p.id === idBuscado);

  // Si no existe, respondemos con 404.
  if (!producto) {
    return pagina(
      res,
      'No encontrado',
      '<div class="error">Producto no encontrado</div>',
      404
    );
  }

  pagina(
    res,
    producto.nombre,
    `<div class="card">
      <h2>${producto.emoji} ${escapar(producto.nombre)}</h2>
      <p class="desc">${escapar(producto.descripcion)}</p>
      <span class="precio">$${producto.precio.toFixed(2)}</span>
    </div>`
  );
});

// GET /api/productos
// Devuelve los productos en formato JSON.
// Todavía utiliza el array en memoria.
app.get('/api/productos', (req, res) => {
  res.json(productos);
});


// ==========================================================
// PASO 6 · API REST CON MONGOOSE
// ==========================================================
//
// A partir de aquí dejamos de trabajar con arrays
// y utilizamos el modelo Usuario.
//
// Los usuarios se almacenarán en MongoDB Atlas.
//
// MÉTODOS HTTP:
//
// GET    = Consultar
// POST   = Crear
// PUT    = Actualizar
// DELETE = Eliminar
//
// CRUD:
// C = Create
// R = Read
// U = Update
// D = Delete
// ==========================================================


// ==========================================================
// ENDPOINT 1 · GET /api/usuarios
// CONSULTAR TODOS LOS USUARIOS
// ==========================================================

app.get('/api/usuarios', async (req, res) => {

  try {

    // find() consulta todos los documentos
    // de la colección usuarios.
    //
    // async indica que la función realiza
    // operaciones asíncronas.
    //
    // await espera el resultado de MongoDB
    // antes de continuar.

    const usuarios = await Usuario.find();

    // HTTP 200: consulta exitosa.
    res.status(200).json(usuarios);

  } catch (error) {

    // HTTP 500: error interno del servidor.
    console.error(error.message);

    res.status(500).json({
      error: 'Error al consultar usuarios'
    });
  }
});


// ==========================================================
// ENDPOINT 2 · GET /api/usuarios/:id
// CONSULTAR UN USUARIO POR SU IDENTIFICADOR
// ==========================================================

app.get('/api/usuarios/:id', async (req, res) => {

  // req.params.id obtiene el ID desde la URL.
  //
  // Ejemplo:
  // /api/usuarios/507f1f77bcf86cd799439011

  const id = req.params.id;

  // MongoDB utiliza identificadores ObjectId.
  // Verificamos que el ID tenga un formato válido.
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      error: 'El id no es válido'
    });
  }

  try {

    // findById() busca un documento por su _id.
    const usuario = await Usuario.findById(id);

    // Si el usuario no existe, devolvemos 404.
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // HTTP 200: usuario encontrado.
    res.status(200).json(usuario);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: 'Error al consultar el usuario'
    });
  }
});


// ==========================================================
// ENDPOINT 3 · POST /api/usuarios
// CREAR UN NUEVO USUARIO
// ==========================================================

app.post('/api/usuarios', async (req, res) => {

  try {

    // req.body contiene el JSON enviado por el cliente.
    //
    // Ejemplo:
    //
    // {
    //   "nombre": "Ana Gómez",
    //   "email": "ana@correo.com",
    //   "rol": "cliente",
    //   "puntos": 10
    // }

    // create() crea y guarda un documento en MongoDB.
    //
    // Antes de guardar, Mongoose comprueba
    // las validaciones definidas en Usuario.js.

    const nuevoUsuario = await Usuario.create(req.body);

    // HTTP 201: recurso creado correctamente.
    res.status(201).json(nuevoUsuario);

  } catch (error) {

    // Si el usuario no cumple las validaciones,
    // Mongoose puede devolver ValidationError.
    //
    // CastError ocurre cuando un valor no puede
    // convertirse al tipo de dato esperado.

    if (
      error.name === 'ValidationError' ||
      error.name === 'CastError'
    ) {

      // HTTP 400: datos inválidos.
      return res.status(400).json({
        error: error.message
      });
    }

    // Otros errores inesperados.
    console.error(error.message);

    res.status(500).json({
      error: 'Error al crear el usuario'
    });
  }
});


// ==========================================================
// ENDPOINT 4 · PUT /api/usuarios/:id
// ACTUALIZAR UN USUARIO EXISTENTE
// ==========================================================

app.put('/api/usuarios/:id', async (req, res) => {

  // Obtenemos el ID desde la URL.
  const id = req.params.id;

  // Validamos el formato del identificador.
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      error: 'El id no es válido'
    });
  }

  try {

    // findByIdAndUpdate() busca y actualiza
    // un documento utilizando su identificador.
    //
    // Parámetros:
    //
    // 1. id: usuario que queremos actualizar.
    // 2. req.body: campos que queremos modificar.
    // 3. opciones:
    //
    // new: true
    // Devuelve el documento actualizado.
    //
    // runValidators: true
    // Aplica las validaciones del esquema
    // durante la actualización.

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    // Si el usuario no existe.
    if (!usuarioActualizado) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // HTTP 200: actualización exitosa.
    res.status(200).json(usuarioActualizado);

  } catch (error) {

    // Error de validación.
    if (
      error.name === 'ValidationError' ||
      error.name === 'CastError'
    ) {
      return res.status(400).json({
        error: error.message
      });
    }

    console.error(error.message);

    res.status(500).json({
      error: 'Error al actualizar el usuario'
    });
  }
});


// ==========================================================
// ENDPOINT 5 · DELETE /api/usuarios/:id
// ELIMINAR UN USUARIO
// ==========================================================

app.delete('/api/usuarios/:id', async (req, res) => {

  // Obtenemos el ID del usuario.
  const id = req.params.id;

  // Validamos el formato del ID.
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      error: 'El id no es válido'
    });
  }

  try {

    // findByIdAndDelete() busca y elimina
    // un documento de MongoDB por su identificador.

    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    // Si no encontramos el usuario.
    if (!usuarioEliminado) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // HTTP 204: operación exitosa sin contenido.
    //
    // Por eso no enviamos ningún JSON.
    res.status(204).send();

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: 'Error al eliminar el usuario'
    });
  }
});


// ==========================================================
// PASO 7 · MANEJO DE RUTAS NO ENCONTRADAS
// ==========================================================

// Si ninguna ruta anterior coincide,
// devolvemos un error 404.
app.use((req, res) => {

  // Las rutas de la API responden con JSON.
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'Endpoint no encontrado'
    });
  }

  // Las páginas web responden con HTML.
  pagina(
    res,
    '404',
    '<div class="error">404 — Esta página no existe</div>',
    404
  );
});


// ==========================================================
// PASO 8 · CONEXIÓN CON MONGODB ATLAS
// ==========================================================

// Obtenemos la cadena de conexión desde .env.
const MONGODB_URI = process.env.MONGODB_URI;

// Comprobamos que exista la variable.
if (!MONGODB_URI) {

  console.error('Falta MONGODB_URI en el archivo .env');

  process.exit(1);
}

// mongoose.connect() devuelve una promesa.
//
// .then() se ejecuta cuando la conexión es exitosa.
// .catch() se ejecuta cuando ocurre un error.

mongoose.connect(MONGODB_URI)

  .then(() => {

    console.log('✅ Conectado a MongoDB Atlas');

    // Iniciamos el servidor después de conectar
    // correctamente con la base de datos.

    app.listen(3000, () => {
      console.log('🌐 Servidor en http://localhost:3000');
    });

  })

  .catch((error) => {

    console.error('❌ Error de conexión:', error.message);

  });


// ==========================================================
// FIN DE LA PRÁCTICA
// ==========================================================
