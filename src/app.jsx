import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoriaDinamica from './CategoriaDinamica  ';

// Componente para la página de inicio con tus tarjetas de categorías
function Home() {
  return (
    <div className="container top-categories" style={{ padding: '20px' }}>
      <h1 className="heading-1">Mejores Categorías</h1>
      <div className="container-categories">
        
        {/* Enlace para Anime */}
        <Link to="/categoria/anime" className="card-category category-anime">
          <p>Anime</p>
          <span>Ver más</span>
        </Link>

        {/* Enlace para DC */}
        <Link to="/categoria/dc" className="card-category category-DC">
          <p>DC</p>
          <span>Ver más</span>
        </Link>

        {/* Enlace para Marvel */}
        <Link to="/categoria/marvel" className="card-category category-marvel">
          <p>Marvel</p>
          <span>Ver más</span>
        </Link>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de la página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Ruta dinámica para las categorías */}
        <Route path="/categoria/:nombreCat" element={<CategoriaDinamica />} />
      </Routes>
    </Router>
  );
}