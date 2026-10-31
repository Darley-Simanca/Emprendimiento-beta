import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoriaDinamica() {
  const { nombreCat } = useParams(); // Captura "marvel", "anime" o "dc" de la URL
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    // Petición a tu servidor backend de Node.js en el puerto 5000
    fetch('http://localhost:5000/api/productos')
      .then(res => res.json())
      .then(data => {
        // Filtra solo los productos de la categoría seleccionada
        const filtrados = data.filter(
          p => p.categoria.toLowerCase() === nombreCat.toLowerCase()
        );
        setProductos(filtrados);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setCargando(false);
      });
  }, [nombreCat]);

  return (
    <main className="container" style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="heading-1">Colección: {nombreCat.toUpperCase()}</h2>
        <Link to="/" className="btn-volver" style={{ textDecoration: 'none', fontWeight: 'bold' }}>← Volver al Inicio</Link>
      </header>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="container-products">
          {productos.length === 0 ? (
            <p>No hay productos disponibles en esta categoría.</p>
          ) : (
            productos.map(prod => (
              <div className="card-product" key={prod.id}>
                <div className="container-img">
                  <img src={prod.imagen} alt={prod.nombre} />
                </div>
                <div className="content-card-product">
                  <h3>{prod.nombre}</h3>
                  <p className="description">{prod.descripcion}</p>
                  <p className="price">${prod.precio.toFixed(2)}</p>
                  <button 
                    className="btn-add-cart" 
                    onClick={() => alert(`¡${prod.nombre} agregado al carrito!`)}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}