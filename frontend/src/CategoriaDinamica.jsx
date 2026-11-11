import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoriaDinamica() {
  const { nombreCat } = useParams();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    // Pide al backend los productos filtrados por categoría
    fetch(`http://localhost:5000/api/productos/categoria/${nombreCat}`)
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar categoría:", err);
        setCargando(false);
      });
  }, [nombreCat]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff', background: '#121212', minHeight: '100vh' }}>
      <Link to="/" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '16px' }}>← Volver al inicio</Link>
      <h1 style={{ textTransform: 'capitalize', marginTop: '20px', color: '#ff007f' }}>Categoría: {nombreCat}</h1>
      
      {cargando ? (
        <p style={{ marginTop: '20px' }}>Cargando productos de {nombreCat}...</p>
      ) : productos.length === 0 ? (
        <p style={{ marginTop: '20px' }}>No hay productos disponibles en esta categoría.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {productos.map(prod => (
            <div key={prod.id || prod._id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px', background: '#1e1e1e' }}>
              {prod.imagen && <img src={prod.imagen} alt={prod.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />}
              <h3 style={{ margin: '10px 0 5px' }}>{prod.nombre}</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>{prod.descripcion}</p>
              <p style={{ fontWeight: 'bold', color: '#00ffcc', marginTop: '10px' }}>${prod.precio}</p>
              <button 
                onClick={() => alert(`¡${prod.nombre} añadido al carrito!`)}
                style={{ background: '#ff007f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '10px', fontWeight: 'bold' }}
              >
                Añadir al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}