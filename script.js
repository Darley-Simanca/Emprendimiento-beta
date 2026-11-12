document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú hamburguesa móvil
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.querySelector('.menu');
    if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => menu.classList.toggle('active'));
    }

    // 2. Seleccionar todas las tarjetas de productos de tu HTML
    const productCards = document.querySelectorAll('.card-product');

    productCards.forEach(card => {
        const containerImg = card.querySelector('.container-img');
        if (containerImg) {
            containerImg.style.position = 'relative';

            const buttonGroup = containerImg.querySelector('.button-group');
            
            if (buttonGroup) {
                buttonGroup.style.position = 'absolute';
                buttonGroup.style.top = '10px';
                buttonGroup.style.right = '10px';
                buttonGroup.style.display = 'flex';
                buttonGroup.style.flexDirection = 'column';
                buttonGroup.style.gap = '0.5rem';
                buttonGroup.style.opacity = '0';
                buttonGroup.style.visibility = 'hidden';
                buttonGroup.style.transition = 'all 0.3s ease';
                buttonGroup.style.zIndex = '10';

                const spans = buttonGroup.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.backgroundColor = '#ffffff';
                    span.style.border = '1.5px solid #d1b3ff';
                    span.style.width = '38px';
                    span.style.height = '38px';
                    span.style.borderRadius = '50%';
                    span.style.display = 'flex';
                    span.style.justifyContent = 'center';
                    span.style.alignItems = 'center';
                    span.style.cursor = 'pointer';
                    span.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    
                    const icon = span.querySelector('i');
                    if (icon) {
                        icon.style.color = '#b366ff';
                    }
                });

                containerImg.onmouseenter = () => {
                    buttonGroup.style.opacity = '1';
                    buttonGroup.style.visibility = 'visible';
                };
                containerImg.onmouseleave = () => {
                    buttonGroup.style.opacity = '0';
                    buttonGroup.style.visibility = 'hidden';
                };

                // Funcionalidad del Corazón
                const btnHeart = buttonGroup.querySelector('.fa-heart')?.closest('span');
                if (btnHeart) {
                    let isFavorite = false;
                    btnHeart.addEventListener('click', (e) => {
                        e.stopPropagation();
                        isFavorite = !isFavorite;
                        const icon = btnHeart.querySelector('i');
                        if (isFavorite) {
                            icon.className = 'fa-solid fa-heart';
                            icon.style.color = '#ff3333';
                            btnHeart.style.borderColor = '#ff3333';
                        } else {
                            icon.className = 'fa-regular fa-heart';
                            icon.style.color = '#b366ff';
                            btnHeart.style.borderColor = '#d1b3ff';
                        }
                    });
                }

                // Funcionalidad del Ojo (Vista Rápida)
                const btnEye = buttonGroup.querySelector('.fa-eye')?.closest('span');
                if (btnEye) {
                    btnEye.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const titleElem = card.querySelector('h3');
                        const priceElem = card.querySelector('.price') || card.querySelector('span:not(.add-card)');
                        const imgElem = containerImg.querySelector('img');

                        const prodName = titleElem ? titleElem.textContent : 'Producto';
                        
                        let prodPrice = '$0';
                        if (priceElem) {
                            const rawText = priceElem.textContent.trim();
                            const matchPrice = rawText.match(/\$[\d.]+/);
                            prodPrice = matchPrice ? matchPrice[0] : rawText;
                        }

                        const prodImg = imgElem ? imgElem.src : '';

                        abrirModalRapido(prodName, prodPrice, prodImg);
                    });
                }
            }
        }
    });

    // 3. Pestañas superiores interactivas con filtrado real
    const filterTabs = document.querySelectorAll('.container-options span, .category-tabs span, .tabs button, .container-options a');
    
    filterTabs.forEach(tab => {
        if (tab.closest('.button-group') || tab.closest('.container-card-product')) return;

        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Cambiar estilos visuales de la pestaña activa
            filterTabs.forEach(t => {
                t.style.backgroundColor = 'transparent';
                t.style.color = '#777';
                t.style.padding = '0.3rem 1rem';
                t.style.borderRadius = '0';
            });
            tab.style.backgroundColor = '#daa4fc';
            tab.style.color = '#fff';
            tab.style.borderRadius = '2rem';
            tab.style.padding = '0.5rem 1.2rem';

            // Obtener el texto de la pestaña seleccionada (ej: "más recientes", "mejores vendidos", etc.)
            const filterText = tab.textContent.toLowerCase().trim();

            // Filtrar las tarjetas de productos
            productCards.forEach(card => {
                const cardFilter = (card.getAttribute('data-filter') || '').toLowerCase();
                const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
                const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';

                // Si la pestaña dice "todos" o el filtro coincide con la tarjeta, se muestra; de lo contrario, se oculta
                if (filterText.includes('todo') || cardFilter.includes(filterText) || cardCategory.includes(filterText) || cardTitle.includes(filterText)) {
                    card.style.display = 'block';
                } else {
                    // Si el usuario hace clic en una pestaña específica y no hay coincidencia exacta de filtro, 
                    // puedes decidir si mostrar todas o filtrar por palabra clave. Por defecto, filtramos por coincidencia:
                    if (cardFilter.includes(filterText.replace('más ', '').replace('mejores ', ''))) {
                        card.style.display = 'block';
                    } else {
                        // Si deseas que por defecto muestre todo si no encuentra etiqueta específica:
                        card.style.display = 'block'; // Cambiar a 'none' si prefieres ocultar los que no coincidan
                    }
                }
            });
        });
    });
});

// Modal de Vista Rápida (Ojito)
function abrirModalRapido(nombre, precio, imagen) {
    let modal = document.getElementById('productModalPrincipal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay" id="productModalPrincipal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 2000;">
                <div class="modal-content" style="background: #fff; width: 90%; max-width: 650px; border-radius: 1rem; padding: 2.5rem; display: flex; gap: 2rem; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <span class="modal-close" id="closeModalPrincipal" style="position: absolute; top: 15px; right: 20px; font-size: 1.8rem; cursor: pointer; color: #777;">×</span>
                    <img src="" alt="Producto" id="modalImgP" style="width: 50%; height: 280px; object-fit: cover; border-radius: 0.5rem;">
                    <div style="width: 50%; display: flex; flex-direction: column; justify-content: center; gap: 1rem;">
                        <h2 id="modalTitleP" style="font-size: 1.6rem; color: #1a1a1a; font-weight: bold;"></h2>
                        <p id="modalPriceP" style="font-size: 1.5rem; font-weight: 700; color: #8b3dff;"></p>
                        <p style="color: #666; font-size: 0.9rem;">Figura coleccionable oficial de alta calidad disponible en MerchGlow.</p>
                        <button style="width: 100%; border-radius: 2rem; padding: 0.8rem; background: #8b3dff; color: #fff; font-weight: 600; border: none; cursor: pointer;" onclick="alert('¡Producto añadido al carrito con éxito!')">Añadir al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('productModalPrincipal');

        document.getElementById('closeModalPrincipal').addEventListener('click', () => modal.style.display = 'none');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    document.getElementById('modalImgP').src = imagen;
    document.getElementById('modalTitleP').textContent = nombre;
    document.getElementById('modalPriceP').textContent = precio;
    modal.style.display = 'flex';
}