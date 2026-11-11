import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoriaDinamica from './CategoriaDinamica';
import './App.css'; // Aquí cargará todos tus estilos originales de MerchGlow

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Conexión a tu backend en Node.js (puerto 5000)
    fetch('http://localhost:5000/api/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al obtener los productos:", err);
        // Intento de respaldo si tu backend no usa la barra /api
        fetch('http://localhost:5000/productos')
          .then(res => res.json())
          .then(data => {
            setProductos(data);
            setCargando(false);
          })
          .catch(() => setCargando(false));
      });
  }, []);

  return (
    <div className="main-container">
      {/* 1. Header superior (Soporte, Logo MerchGlow y Carrito) */}
      <header className="top-header">
        <div className="support-info">
          <span>Soporte al Cliente: 123-456-7890</span>
        </div>
        <div className="logo">
          <h1>MERCHGLOW</h1>
        </div>
        <div className="cart-user-actions">
          <button className="btn-cart">Carrito (1)</button>
        </div>
      </header>

      {/* 2. Barra de Navegación con Links Dinámicos a las Categorías */}
      <nav className="main-nav">
        <ul className="nav-links">
          <li><Link to="/">INICIO</Link></li>
          <li><Link to="/categoria/anime">ANIME</Link></li>
          <li><Link to="/categoria/dc">DC</Link></li>
          <li><Link to="/categoria/marvel">MARVEL</Link></li>
          <li><Link to="/categoria/videojuegos">VIDEOJUEGOS</Link></li>
          <li><Link to="/contacto">CONTACTO</Link></li>
          <li><Link to="/admin">ADMIN</Link></li>
        </ul>
        <div className="search-box">
          <input type="text" placeholder="Buscar productos..." />
          <button className="btn-search">🔍</button>
        </div>
      </nav>

      {/* 3. Banner Hero con la imagen de fondo */}
      <section className="hero-banner">
        <div className="hero-content">
          <p>Merch Increíble</p>
          <h2>Tu Colección<br />Estilo Único</h2>
          <button className="btn-primary">COMPRAR AHORA</button>
        </div>
      </section>

      {/* 4. Tarjetas de Categorías Principales */}
      <section className="categories-section container">
        <h2 className="heading-1">Mejores Categorías</h2>
        <div className="container-categories">
          <Link to="/categoria/anime" className="card-category category-anime">
            <p>Anime</p>
            <span>Ver más</span>
          </Link>
          <Link to="/categoria/dc" className="card-category category-dc">
            <p>DC</p>
            <span>Ver más</span>
          </Link>
          <Link to="/categoria/marvel" className="card-category category-marvel">
            <p>Marvel</p>
            <span>Ver más</span>
          </Link>
        </div>
      </section>

      {/* 5. Catálogo Dinámico desde MongoDB */}
      <section className="products-section container">
        <h2 className="heading-1">Todos los Productos</h2>
        
        {cargando ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Cargando catálogo desde la base de datos...</p>
        ) : productos.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No hay productos cargados en MongoDB. Agrega algunos desde MongoDB Compass o tu panel de Admin.</p>
        ) : (
          <div className="container-products">
            {productos.map(prod => (
              <div className="card-product" key={prod._id || prod.id}>
                <div className="container-img">
                  <img src={prod.imagen || 'https://via.placeholder.com/200'} alt={prod.nombre} />
                </div>
                <div className="content-card-product">
                  <h3>{prod.nombre}</h3>
                  <p className="description">{prod.descripcion}</p>
                  <p className="price">${prod.precio}</p>
                  <button 
                    className="btn-add-cart"
                    onClick={() => alert(`¡${prod.nombre} agregado al carrito!`)}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:nombreCat" element={<CategoriaDinamica />} />
      </Routes>
    </Router>
  );
}