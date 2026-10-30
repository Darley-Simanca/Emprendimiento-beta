document.addEventListener('DOMContentLoaded', () => {
    // 1. FUNCIONALIDAD DEL MENÚ HAMBURGUESA (Móvil)
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.querySelector('.menu');

    if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // 2. FILTRADO POR CATEGORÍAS (Menú superior y tarjetas de categorías)
    const menuLinks = document.querySelectorAll('.menu a');
    const categoryCards = document.querySelectorAll('.card-category');
    const productCards = document.querySelectorAll('.card-product');
    const productsSection = document.querySelector('#productos');

    function filtrarProductos(termino) {
        const query = termino.toLowerCase().trim();

        productCards.forEach(card => {
            const categoria = card.getAttribute('data-category') || '';
            const titulo = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';

            if (categoria.includes(query) || titulo.includes(query) || query === 'inicio' || query === 'todos') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        if (productsSection && query !== 'inicio') {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Clics en el menú superior
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const texto = link.textContent.toLowerCase().trim();
            if (texto === 'inicio') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                productCards.forEach(card => card.style.display = 'block');
                if (menu) menu.classList.remove('active');
                return;
            }

            if (['anime', 'dc', 'marvel', 'videojuegos'].includes(texto)) {
                e.preventDefault();
                filtrarProductos(texto);
                if (menu) menu.classList.remove('active');
            }
        });
    });

    // Clics en las tarjetas de categorías principales ("Ver más")
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const catText = card.querySelector('p').textContent.toLowerCase().trim();
            filtrarProductos(catText);
        });
    });

    // 3. BUSCADOR EN TIEMPO REAL
    const searchInput = document.querySelector('.search-form input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filtrarProductos(e.target.value);
        });
    }

    // 4. CARRITO DE COMPRAS BÁSICO (Contador dinámico)
    let carritoCount = 0;
    const addCardButtons = document.querySelectorAll('.add-card, .btn-read-more');
    const cartCounterDisplay = document.querySelector('.content-shopping-cart .number');

    addCardButtons.forEach(btn => {
        // Evitamos afectar botones de envío o formularios
        if (btn.tagName === 'BUTTON' && btn.type === 'submit') return;

        btn.addEventListener('click', (e) => {
            // Si el botón está dentro de un blog o formulario que no es producto, ignorar
            if (btn.closest('.blogs') || btn.closest('.contact-section')) return;

            carritoCount++;
            if (cartCounterDisplay) {
                cartCounterDisplay.textContent = `(${carritoCount})`;
            }
            
            // Animación sutil o alerta rápida opcional
            const productName = btn.closest('.card-product') ? btn.closest('.card-product').querySelector('h3').textContent : 'Producto';
            console.log(`Agregado al carrito: ${productName}`);
        });
    });
});

// 5. PANEL DE ADMINISTRACIÓN (Login funcional)
function loginAdmin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    const dashboard = document.getElementById('admin-dashboard');

    if (user === 'admin@merchglow.com' && pass === 'admin123') {
        dashboard.style.display = 'block';
        alert('¡Acceso concedido al Panel de Control!');
    } else {
        alert('Credenciales incorrectas. Usa:\nCorreo: admin@merchglow.com\nContraseña: admin123');
    }
}

// 6. CHATBOT DE ASISTENCIA INTELIGENTE (IA Simulada)
function toggleChat() {
    const chatBox = document.getElementById('chatbot-box');
    if (chatBox) {
        chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    
    if (!input || !messagesContainer) return;
    const text = input.value.trim();
    if (text === '') return;

    // Mostrar mensaje del usuario
    messagesContainer.innerHTML += `<div><strong>Tú:</strong> ${text}</div>`;
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Respuesta simulada de la IA basada en palabras clave
    setTimeout(() => {
        let respuesta = "¡Excelente consulta! Contamos con envíos gratuitos y pago contra reembolso.";
        const query = text.toLowerCase();

        if (query.includes('anime') || query.includes('gaara')) {
            respuesta = "¡Tenemos figuras increíbles de Anime como Gaara y William Moriarty disponibles en el catálogo!";
        } else if (query.includes('dc') || query.includes('batman') || query.includes('damian') || query.includes('jason')) {
            respuesta = "¡De DC Comics tenemos a Damian Wayne y Jason Todd esperando por ti!";
        } else if (query.includes('marvel') || query.includes('spider') || query.includes('iron')) {
            respuesta = "¡El universo Marvel está presente con Spider-Man y Iron Man en oferta!";
        } else if (query.includes('precio') || query.includes('cuánto cuesta')) {
            respuesta = "Los precios varían entre $26.000 y $56.000 pesos colombianos con descuentos especiales.";
        }

        messagesContainer.innerHTML += `<div><strong>IA:</strong> ${respuesta}</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 600);
}

// Función para obtener los productos del backend
async function cargarProductos() {
    try {
        const respuesta = await fetch('http://localhost:5000/api/productos');
        const productos = await respuesta.json();
        
        console.log("Productos cargados desde el servidor:", productos);
        
        // AQUÍ LLAMAS A TU FUNCIÓN QUE PINTA LOS PRODUCTOS EN LA PÁGINA
        // Por ejemplo: mostrarProductosEnHTML(productos);
        
    } catch (error) {
        console.error("Error al conectar con el servidor backend:", error);
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);