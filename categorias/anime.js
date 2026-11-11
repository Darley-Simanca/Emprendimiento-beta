document.addEventListener("DOMContentLoaded", () => {
            const categoria = "anime";
            const contenedor = document.getElementById("contenedor-productos-categoria");

            function cargarProductos(subcategoria = null) {
                let url = `http://localhost:5000/api/productos/categoria/${categoria}`;
                if (subcategoria) {
                    url += `?sub=${subcategoria}`;
                }

                fetch(url)
                    .then(res => res.json())
                    .then(productos => {
                        if (!contenedor) return;
                        contenedor.innerHTML = "";

                        if (!productos || productos.length === 0) {
                            contenedor.innerHTML = '<p style="color: #777; padding: 20px; font-size: 1.4rem;">No hay productos disponibles en esta categoría.</p>';
                            return;
                        }

                        productos.forEach(prod => {
                            const card = document.createElement("div");
                            card.className = "card-product";
                            card.innerHTML = `
                                <div class="container-img">
                                    <img src="${prod.imagen ? '../' + prod.imagen : '../img/default.jpg'}" alt="${prod.nombre}">
                                </div>
                                <div class="container-card-product">
                                    <div class="star">
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                        <i class="fa-solid fa-star"></i>
                                    </div>
                                    <h3>${prod.nombre}</h3>
                                    <button class="add-card" onclick="alert('¡${prod.nombre} añadido al carrito!')">
                                        <i class="fa-solid fa-bag-shopping"></i>
                                    </button>
                                    <p class="price">$${prod.precio} <span>$${Math.round(prod.precio * 1.2)}</span></p>
                                </div>
                            `;
                            contenedor.appendChild(card);
                        });
                    })
                    .catch(err => {
                        console.error("Error al conectar con el servidor:", err);
                        if (contenedor) {
                            contenedor.innerHTML = '<p style="color: #ff5555; padding: 20px; font-size: 1.4rem;">Error al conectar con la base de datos.</p>';
                        }
                    });
            }

            cargarProductos();

            const subCards = document.querySelectorAll(".sub-card");
            subCards.forEach(card => {
                card.addEventListener("click", (e) => {
                    e.preventDefault();
                    const sub = card.getAttribute("data-sub");
                    cargarProductos(sub);
                });
            });
        });