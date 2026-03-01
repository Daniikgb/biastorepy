// Ensure page starts at top on load
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

// Rest of the script
document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Lucide Icons
    lucide.createIcons();

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.setAttribute('data-lucide', 'x');
                document.body.style.overflow = 'hidden'; // Lock scroll
            } else {
                icon.setAttribute('data-lucide', 'menu');
                document.body.style.overflow = ''; // Unlock scroll
            }
            lucide.createIcons();
        });

        // Close menu when clicking links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                const icon = menuToggle.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // 3. Scroll Reveal Engine
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. Filtering System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.p-panel-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    // 5. WhatsApp Form Handler
    const waForm = document.getElementById('whatsappForm');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('userName').value;
            const product = document.getElementById('productName').value;
            const message = document.getElementById('userMessage').value;
            const phoneNumber = '595985856487';

            const text = `Hola Biastorepyy! 👋\n\nNombre: *${name}*\nInterés: *${product}*\n\nConsulta: ${message}`;
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    // 6. Size Guide Modal
    const modal = document.getElementById('sizeGuideModal');
    const closeBtn = document.querySelector('.close-modal');

    // We can add a trigger globally or specific buttons
    window.openSizeGuide = () => modal.classList.add('active');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // 7. Navbar dynamic background
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.95)';
        } else {
            header.style.background = 'rgba(5, 5, 5, 0.8)';
        }
    });

    // 8. Search Functionality
    const searchTrigger = document.getElementById('searchTrigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.getElementById('searchInput');

    searchTrigger?.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch?.addEventListener('click', () => searchOverlay.classList.remove('active'));

    searchInput?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        productCards.forEach(card => {
            const title = card.querySelector('.p-info h3')?.textContent.toLowerCase() || "";
            if (title.includes(term)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0';
                card.style.display = 'none';
            }
        });
    });

    // 9. Shopping Bag (Cart) Logic
    let cart = JSON.parse(localStorage.getItem('bias_cart')) || [];
    const cartTrigger = document.getElementById('cartTrigger');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartBadge = document.querySelector('.cart-badge');
    const cartTotalAmount = document.getElementById('cartTotalAmount');

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">Tu bolsa está vacía</p>';
            cartBadge.classList.remove('show');
        } else {
            cartBadge.textContent = cart.length;
            cartBadge.classList.add('show');

            cart.forEach((item, index) => {
                const priceMatch = item.price.match(/\d+/g);
                const priceValue = priceMatch ? parseInt(priceMatch.join('')) : 0;
                total += priceValue;

                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                        <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
        cartTotalAmount.textContent = `${total.toLocaleString('es-PY')} Gs.`;
        localStorage.setItem('bias_cart', JSON.stringify(cart));
    }

    window.addToCart = (name, price, img) => {
        cart.push({ name, price, img });
        updateCartUI();
        cartDrawer.classList.add('active');
    };

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        updateCartUI();
    };

    cartTrigger?.addEventListener('click', () => cartDrawer.classList.add('active'));
    closeCart?.addEventListener('click', () => cartDrawer.classList.remove('active'));

    // Checkout
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) return alert('La bolsa está vacía');

        let message = '¡Hola Biastorepyy! 👋 Quiero realizar este pedido:\n\n';
        cart.forEach((item, i) => {
            message += `${i + 1}. *${item.name}* - ${item.price}\n`;
        });
        message += `\n*Total Estimado:* ${cartTotalAmount.textContent}`;

        const phoneNumber = '595985856487';
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Initial UI Sync
    updateCartUI();

    // Connect Product "Comprar" buttons (Optional - if we want to change old behavior)
    // For now, they can just use the global window.addToCart if we update index.html
});

