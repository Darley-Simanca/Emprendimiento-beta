document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. CONTADOR DEL CARRITO DE COMPRAS
    // -------------------------------------------------------------
    const addCartButtons = document.querySelectorAll('.add-card');
    const cartCounter = document.querySelector('.content-shopping-cart .number');
    let totalItems = 0;

    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita interferencias con otros elementos
            totalItems++;
            if (cartCounter) {
                cartCounter.textContent = `(${totalItems})`;
            }

            // Animación visual al agregar al carrito
            button.style.transform = 'scale(1.2)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // -------------------------------------------------------------
    // 2. LISTA DE DESEOS (FAVORITOS - CORAZÓN)
    // -------------------------------------------------------------
    const heartIcons = document.querySelectorAll('.button-group .fa-heart');

    heartIcons.forEach(heart => {
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Alterna entre corazón vacío y lleno
            if (heart.classList.contains('fa-regular')) {
                heart.classList.remove('fa-regular');
                heart.classList.add('fa-solid');
                heart.style.color = '#e74c3c'; // Rojo para favoritos
            } else {
                heart.classList.remove('fa-solid');
                heart.classList.add('fa-regular');
                heart.style.color = ''; // Color por defecto
            }
        });
    });

    // -------------------------------------------------------------
    // 3. PESTAÑAS DE FILTRADO ("MEJORES PRODUCTOS")
    // -------------------------------------------------------------
    const optionTabs = document.querySelectorAll('.container-options span');

    optionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            optionTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // -------------------------------------------------------------
    // 4. BUSCADOR INTERACTIVO EN TIEMPO REAL
    // -------------------------------------------------------------
    const searchInput = document.querySelector('.search-form input[type="search"]');
    const productCards = document.querySelectorAll('.card-product');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            productCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                
                if (title.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // -------------------------------------------------------------
    // 5. MENÚ RESPONSIVE (MÓVIL / HAMBURGUESA)
    // -------------------------------------------------------------
    const menuToggle = document.querySelector('.navbar .fa-bars');
    const navMenu = document.querySelector('.menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Estilos rápidos mediante JS
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#daa4fc',
        color: '#333',
        padding: '12px 24px',
        borderRadius: '25px',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Ejemplo de uso al hacer clic en el carrito:
// showNotification("¡Producto agregado a tu colección!");