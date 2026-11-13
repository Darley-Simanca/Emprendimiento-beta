document.addEventListener("DOMContentLoaded", () => {
    const categoria = "dc";
    const contenedor = document.getElementById("contenedor-productos-categoria");

    // Crear dinámicamente el Modal para la Vista Rápida en el DOM si no existe
    if (!document.getElementById("productModal")) {
        const modalHTML = `
            <div class="modal-overlay" id="productModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: none; justify-content: center; align-items: center; z-index: 1000;">
                <div class="modal-content" style="background: #fff; width: 90%; max-width: 700px; border-radius: 1rem; padding: 2.5rem; display: flex; gap: 2rem; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    <span class="modal-close" id="closeModal" style="position: absolute; top: 15px; right: 20px; font-size: 1.8rem; cursor: pointer; color: #777;">×</span>
                    <img src="" alt="Producto" class="modal-img" id="modalImg" style="width: 50%; height: 300px; object-fit: cover; border-radius: 0.5rem;">
                    <div class="modal-details" style="width: 50%; display: flex; flex-direction: column; justify-content: center; gap: 1rem;">
                        <h2 id="modalTitle" style="font-size: 1.8rem; color: #1a1a1a;"></h2>
                        <p class="price" id="modalPrice" style="font-size: 1.6rem; font-weight: 700; color: #8b3dff;"></p>
                        <p style="color: #666; font-size: 0.95rem;">Figura coleccionable de alta calidad con detalles oficiales de MerchGlow.</p>
                        <button style="width: 100%; border-radius: 2rem; padding: 0.8rem; background: #8b3dff; color: #fff; font-weight: 600; border: none; cursor: pointer;" onclick="alert('¡Producto añadido al carrito!')">Añadir al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById("productModal");
    const closeModal = document.getElementById("closeModal");
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalPrice = document.getElementById("modalPrice");

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    function cargarProductos(subcategoria = null) {
        let url = `http://localhost:5000/api/productos/categoria/${categoria}`;
        
        // Si hay subcategoría y no está vacía, la añadimos a la petición
        if (subcategoria && subcategoria.trim() !== "") {
            url += `?sub=${encodeURIComponent(subcategoria)}`;
        }

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta del servidor");
                return res.json();
            })
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
                    
                    let imagenSrc = prod.imagen;
                    if (imagenSrc && !imagenSrc.startsWith("http") && !imagenSrc.startsWith("../")) {
                        imagenSrc = "../" + imagenSrc;
                    } else if (!imagenSrc) {
                        imagenSrc = "../img/default.jpg";
                    }

                    // Validación opcional de descuento y precio original
                    let descuentoHTML = "";
                    let precioHTML = "";

                    if (prod.descuento && prod.precioOriginal) {
                        descuentoHTML = `<span class="discount" style="position: absolute; top: 10px; left: 10px; background-color: #b366ff; color: #fff; font-size: 0.85rem; font-weight: 700; padding: 0.3rem 0.7rem; border-radius: 1rem; z-index: 2; transition: background-color 0.3s ease;">${prod.descuento}</span>`;
                        precioHTML = `$${prod.precio.toLocaleString()} <span style="font-size: 1rem; font-weight: 400; text-decoration: line-through; color: #999999;">$${prod.precioOriginal.toLocaleString()}</span>`;
                    } else {
                        descuentoHTML = "";
                        precioHTML = `$${prod.precio.toLocaleString()}`;
                    }

                    card.innerHTML = `
                        <div class="container-img" style="position: relative; width: 100%; height: 220px; display: flex; justify-content: center; align-items: center; overflow: hidden; border-radius: 0.5rem;">
                            ${descuentoHTML}
                            <img src="${imagenSrc}" alt="${prod.nombre}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;">
                            <div class="button-group" style="position: absolute; top: 10px; right: 10px; display: flex; flex-direction: column; gap: 0.5rem; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 2;">
                                <span class="btn-eye" title="Vista rápida" style="background-color: #ffffff; border: 1.5px solid #d1b3ff; width: 38px; height: 38px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;"><i class="fa-regular fa-eye" style="color: #b366ff;"></i></span>
                                <span class="btn-heart" title="Añadir a favoritos" style="background-color: #ffffff; border: 1.5px solid #d1b3ff; width: 38px; height: 38px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;"><i class="fa-regular fa-heart" style="color: #b366ff;"></i></span>
                                <span title="Comparar" style="background-color: #ffffff; border: 1.5px solid #d1b3ff; width: 38px; height: 38px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;"><i class="fa-solid fa-code-pull-request" style="color: #b366ff;"></i></span>
                            </div>
                        </div>
                        <div class="container-card-product" style="display: flex; flex-direction: column; align-items: center; margin-top: 1rem; gap: 0.5rem;">
                            <div class="star" style="font-size: 1.1rem; color: #c488ff;">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star-half-stroke"></i>
                            </div>
                            <h3 style="font-weight: 700; font-size: 1.3rem; color: #1a1a1a; text-align: center; margin: 0.2rem 0;">${prod.nombre}</h3>
                            
                            <div class="card-bottom-row" style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 0.8rem; padding-top: 0.5rem;">
                                <button class="add-card" style="background: transparent; border: 2px solid #d1b3ff; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center;" onclick="alert('¡${prod.nombre} añadido al carrito!')">
                                    <i class="fa-solid fa-basket-shopping" style="font-size: 1.2rem; color: #b366ff;"></i>
                                </button>
                                <div class="price-box" style="display: flex; align-items: center; gap: 0.6rem;">
                                    <p class="price" style="font-size: 1.4rem; font-weight: 700; color: #8b3dff;">${precioHTML}</p>
                                </div>
                            </div>
                        </div>
                    `;

                    // Hover para mostrar botones flotantes y cambiar etiqueta a negro (si existe)
                    const containerImg = card.querySelector(".container-img");
                    const buttonGroup = card.querySelector(".button-group");
                    const discountTag = card.querySelector(".discount");

                    containerImg.addEventListener("mouseenter", () => {
                        buttonGroup.style.opacity = "1";
                        buttonGroup.style.visibility = "visible";
                        if (discountTag) discountTag.style.backgroundColor = "#000000";
                    });

                    containerImg.addEventListener("mouseleave", () => {
                        buttonGroup.style.opacity = "0";
                        buttonGroup.style.visibility = "hidden";
                        if (discountTag) discountTag.style.backgroundColor = "#b366ff";
                    });

                    // Ojito (Vista Rápida)
                    const btnEye = card.querySelector(".btn-eye");
                    btnEye.addEventListener("click", (e) => {
                        e.stopPropagation();
                        modalImg.src = imagenSrc;
                        modalTitle.textContent = prod.nombre;
                        modalPrice.textContent = `$${prod.precio.toLocaleString()}`;
                        modal.style.display = "flex";
                    });

                    // Corazón (Favoritos)
                    const btnHeart = card.querySelector(".btn-heart");
                    let isFavorite = false;
                    btnHeart.addEventListener("click", (e) => {
                        e.stopPropagation();
                        isFavorite = !isFavorite;
                        const icon = btnHeart.querySelector("i");
                        if (isFavorite) {
                            icon.className = "fa-solid fa-heart";
                            icon.style.color = "#ff3333";
                            btnHeart.style.borderColor = "#ff3333";
                        } else {
                            icon.className = "fa-regular fa-heart";
                            icon.style.color = "#b366ff";
                            btnHeart.style.borderColor = "#d1b3ff";
                        }
                    });

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

    // Cargar todos los productos por defecto al entrar
    cargarProductos();

    // Evento para los botones de las subcategorías (incluyendo "Todo")
    const subCards = document.querySelectorAll(".sub-card");
    subCards.forEach(card => {
        card.addEventListener("click", (e) => {
            e.preventDefault();
            const sub = card.getAttribute("data-sub");
            cargarProductos(sub);
        });
    });
});