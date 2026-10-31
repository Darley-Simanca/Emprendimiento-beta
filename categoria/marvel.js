document.addEventListener('DOMContentLoaded', async () => {
    const contenedorGrid = document.getElementById('grid-marvel');

    try {
        // Como 'marvel.json' está en la misma carpeta, se carga directamente
        const respuesta = await fetch('marvel.json');
        const productos = await respuesta.json();

        contenedorGrid.innerHTML = '';

        if (productos.length === 0) {
            contenedorGrid.innerHTML = '<p>No hay productos disponibles en la categoría Marvel.</p>';
            return;
        }

        // Recorremos cada producto del JSON para crear su tarjeta
        productos.forEach(prod => {
            contenedorGrid.innerHTML += `
                <div class="card-product">
                    <div class="container-img">
                        <img src="${prod.imagen}" alt="${prod.nombre}">
                    </div>
                    <div class="content-card-product">
                        <h3>${prod.nombre}</h3>
                        <p class="description">${prod.descripcion || ''}</p>
                        <p class="price">$${prod.precio.toFixed(2)}</p>
                        <button class="btn-add-cart" onclick="alert('¡Producto agregado al carrito!')">Añadir al carrito</button>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al cargar los productos de Marvel:", error);
        contenedorGrid.innerHTML = '<p>Error al cargar los productos de Marvel.</p>';
    }
});