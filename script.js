// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE MODALES (PRINCIPALES) ---
    
    const modalButtons = [
        { btnId: 'btnLugar', modalId: 'modalLugar' },
        { btnId: 'btnFotos', modalId: 'modalFotos' },
        { btnId: 'linkBrindis', modalId: 'modalBrindis' },
        { btnId: 'btnConfirmar', modalId: 'modalConfirmar' } // <-- LÍNEA ACTUALIZADA
    ];

    // Selecciona todos los modales EXCEPTO el modal de alerta
    const allModals = document.querySelectorAll('.modal:not(#modalAlert)');
    const closeButtons = document.querySelectorAll('.modal:not(#modalAlert) .close-btn');

    // Función para abrir un modal
    const openModal = (modal) => {
        modal.style.display = 'block';
    };

    // Función para cerrar un modal
    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    // Asignar evento a cada botón de acción
    modalButtons.forEach(item => {
        const btn = document.getElementById(item.btnId);
        // [CORREGIDO] Se usa item.modalId para encontrar el modal correcto
        const modal = document.getElementById(item.modalId); 
        
        if (btn && modal) {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Evita que el link '#' salte la página
                openModal(modal);
            });
        } else {
            // Error mejorado para saber qué falta
            if (!btn) console.error(`Botón no encontrado: #${item.btnId}`);
            if (!modal) console.error(`Modal no encontrado: #${item.modalId}`);
        }
    });

    // Asignar evento a los botones de cerrar (la 'x') DE LOS MODALES PRINCIPALES
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    // Cerrar modal si se hace clic fuera del contenido (Ignora la alerta)
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') && e.target.id !== 'modalAlert') {
            closeModal(e.target);
        }
    });

    // --- LÓGICA MODO OSCURO/CLARO ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.material-icons-sharp');

    const applyTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.textContent = 'dark_mode';
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.textContent = 'light_mode';
        }
    };
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);

    themeToggle.addEventListener('click', () => {
        applyTheme(!document.body.classList.contains('dark-mode'));
    });

    // ========================================================
    // ===== LÓGICA DE ALERTA PERSONALIZADA =====
    // ========================================================
    const modalAlert = document.getElementById('modalAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertCloseBtn = document.getElementById('alertCloseBtn');
    const alertCloseX = modalAlert.querySelector('.close-btn'); // La 'x' específica de la alerta

    /**
     * Muestra el modal de alerta personalizado.
     * @param {string} message - El mensaje a mostrar.
     * @param {function | null} callback - Una función a ejecutar después de cerrar la alerta.
     */
    const showAlert = (message, callback = null) => {
        alertMessage.textContent = message;
        openModal(modalAlert);

        // Función única para cerrar (y ejecutar callback si existe)
        const closeAndCallback = () => {
            closeModal(modalAlert);
            if (callback) {
                callback();
            }
        };

        // Agrega listeners que solo se ejecutan una vez
        alertCloseBtn.addEventListener('click', closeAndCallback, { once: true });
        alertCloseX.addEventListener('click', closeAndCallback, { once: true });
    };

    
    // (Lógica formulario RSVP eliminada)


    // --- LÓGICA CARRUSEL (Modal 3) ---
    const slide = document.querySelector('.carousel-slide');
    const images = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Comprobación para evitar errores si no hay carrusel
    if (slide && images.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalImages = images.length;

        const updateCarousel = () => {
            slide.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateCarousel();
        });
    }

    // (Lógica subida de fotos eliminada)


    // ========================================================
    // ===== INICIO DE CAMBIO (Efecto Tilt 3D para Foto) =====
    // ========================================================
    const card = document.querySelector('.card');
    const profilePic = document.querySelector('.profile-pic');
    
    if (card && profilePic) {
        const maxRotate = 15; // Grados máximos de rotación

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Coordenadas del mouse relativas a la tarjeta
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Centro de la tarjeta
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Distancia del centro
            const deltaX = x - centerX;
            const deltaY = y - centerY;

            // Calcular rotación
            // Rotación Y (izquierda/derecha) basada en deltaX
            // Rotación X (arriba/abajo) basada en deltaY (invertida)
            const rotateY = (deltaX / centerX) * maxRotate;
            const rotateX = (-1 * deltaY / centerY) * maxRotate;

            // Aplicar la transformación
            profilePic.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        // Resetear la transformación cuando el mouse sale de la tarjeta
        card.addEventListener('mouseleave', () => {
            profilePic.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }
    // ===== FIN DE CAMBIO =====

});