document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú hamburguesa móvil
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.querySelector('.menu');
    if (menuIcon && menu) {
        menuIcon.addEventListener('click', () => menu.classList.toggle('active'));
    }
let chatWindow = document.getElementById('chatBotWindow');
    
    // Si la ventana no existe en el HTML, la creamos con estructura interactiva
    if (!chatWindow) {
        const chatHTML = `
            <div id="chatBotWindow" style="position: fixed; bottom: 80px; right: 20px; width: 320px; height: 420px; background: #fff; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.2); display: none; flex-direction: column; z-index: 9999; overflow: hidden; border: 1px solid #d1b3ff; font-family: sans-serif;">
                <div style="background: #8b3dff; color: #fff; padding: 1rem; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                    <span>Asistente MerchGlow 🤖</span>
                    <span id="closeChatBtn" style="cursor: pointer; font-size: 1.5rem; line-height: 1;">×</span>
                </div>
                <div id="chatMessagesContainer" style="flex: 1; padding: 1rem; overflow-y: auto; background: #f9f6ff; display: flex; flex-direction: column; gap: 0.8rem;">
                    <div style="background: #e6ccff; padding: 0.6rem 1rem; border-radius: 0.8rem; max-width: 85%; align-self: flex-start; font-size: 0.9rem; color: #333;">
                        ¡Hola! 💜 ¿Qué figura coleccionable o producto de Marvel o DC buscas hoy en MerchGlow?
                    </div>
                </div>
                <div style="padding: 0.8rem; display: flex; gap: 0.5rem; border-top: 1px solid #eee; background: #fff;">
                    <input type="text" id="chatInputText" placeholder="Escribe tu mensaje..." style="flex: 1; padding: 0.6rem; border: 1px solid #ccc; border-radius: 1rem; outline: none; font-size: 0.9rem;">
                    <button id="chatSendBtn" style="background: #8b3dff; color: #fff; border: none; padding: 0.6rem 1rem; border-radius: 1rem; cursor: pointer; font-weight: bold;">Enviar</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
        chatWindow = document.getElementById('chatBotWindow');
    }

    // Vincular apertura con el icono flotante (el icono de robot que tienes en la esquina)
    const existingBotIcon = document.querySelector('.fa-robot') ? document.querySelector('.fa-robot').closest('div') : null;

    if (existingBotIcon) {
        existingBotIcon.style.cursor = 'pointer';
        existingBotIcon.addEventListener('click', () => {
            const isVisible = chatWindow.style.display === 'flex';
            chatWindow.style.display = isVisible ? 'none' : 'flex';
        });
    }

    // Botón para cerrar la ventana dentro del chat
    const closeChatBtn = document.getElementById('closeChatBtn');
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });
    }

    // Lógica para enviar mensajes y responder
    const sendBtn = document.getElementById('chatSendBtn');
    const inputTxt = document.getElementById('chatInputText');
    const messagesContainer = document.getElementById('chatMessagesContainer');

    function enviarMensaje() {
        const texto = inputTxt.value.trim();
        if (texto === '') return;

        // 1. Mostrar mensaje del usuario
        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'background: #8b3dff; color: #fff; padding: 0.6rem 1rem; border-radius: 0.8rem; max-width: 85%; align-self: flex-end; font-size: 0.9rem; word-break: break-word;';
        userMsg.textContent = texto;
        messagesContainer.appendChild(userMsg);

        inputTxt.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 2. Respuesta automática inteligente del bot después de medio segundo
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.style.cssText = 'background: #e6ccff; color: #333; padding: 0.6rem 1rem; border-radius: 0.8rem; max-width: 85%; align-self: flex-start; font-size: 0.9rem; word-break: break-word;';
            
            let respuesta = "¡Excelente elección! Tenemos stock disponible de ese coleccionable en MerchGlow.";
            const t = texto.toLowerCase();
            if (t.includes('hola') || t.includes('buenos')) {
                respuesta = "¡Hola! Bienvenido a MerchGlow. ¿Te puedo ayudar a encontrar alguna figura de anime, Marvel o DC?";
            } else if (t.includes('precio') || t.includes('cuanto') || t.includes('cuesta')) {
                respuesta = "Nuestros precios varían entre $25.000 y $55.000 COP con excelentes descuentos aplicados.";
            } else if (t.includes('marvel') || t.includes('spider') || t.includes('avengers')) {
                respuesta = "¡Revisa nuestra sección de Marvel! Tenemos figuras de Spider-Man, Avengers y Deadpool con envío rápido.";
            } else if (t.includes('dc') || t.includes('batman') || t.includes('superman')) {
                respuesta = "En la categoría DC contamos con Damian Wayne, Batman y Superman. ¡Echa un vistazo al catálogo!";
            }

            botMsg.textContent = respuesta;
            messagesContainer.appendChild(botMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
    }

    if (sendBtn && inputTxt) {
        sendBtn.addEventListener('click', enviarMensaje);
        inputTxt.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensaje();
            }
        });
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

    // 3. Pestañas superiores interactivas con simulación de filtrado dinámico
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

            const tabText = tab.textContent.toLowerCase().trim();

            // Lógica de visualización dinámica según la pestaña presionada
            productCards.forEach((card, index) => {
                if (tabText.includes('reciente')) {
                    // Si pinchan "Más Recientes", mostramos por ejemplo la mitad de las tarjetas o las simulamos
                    if (index < 2) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                } else if (tabText.includes('vendido')) {
                    // Si pinchan "Mejores Vendidos", mostramos otras tarjetas diferentes
                    if (index >= 2) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                } else {
                    // Si es otra pestaña o "todos", mostramos todas las tarjetas
                    card.style.display = 'block';
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