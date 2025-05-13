// JScript.js - Complete Cart & Responsive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // ===== GLOBAL CART SYSTEM =====
    let cart = JSON.parse(localStorage.getItem('nikeCart')) || [];
    
    // ===== MOBILE MENU TOGGLE =====
     const mobileMenu = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            // Prevent event from affecting the cart link
            if (e.target.classList.contains('bar')) {
                mobileMenu.classList.toggle('active');
                navbarMenu.classList.toggle('active');
            }
        });
    }

    // Close menu when clicking on nav links
    document.querySelectorAll('.navbar-links').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    });

    // ===== UPDATE CART COUNT (ALL PAGES) =====
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems > 0 ? totalItems : '';
        }
    }

    // ===== PRODUCT DETAILS PAGE =====
    if (document.querySelector('.product-details-card')) {
        document.querySelectorAll('.buyButton').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-details-card');
                const product = {
                    id: productCard.dataset.id || Date.now().toString(),
                    name: productCard.querySelector('.product-details-title').textContent,
                    price: parseFloat(productCard.querySelector('.product-details-price').textContent.replace('$', '')),
                    image: productCard.querySelector('.product-details-img').src,
                    size: productCard.querySelector('.size-selector select').value,
                    quantity: 1
                };

                // Check if item exists in cart
                const existingItem = cart.find(item => 
                    item.id === product.id && item.size === product.size);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }

                localStorage.setItem('nikeCart', JSON.stringify(cart));
                updateCartCount();
                
                // Show confirmation and optionally redirect
                const shouldRedirect = confirm(`${product.name} added to cart! Go to cart now?`);
                if (shouldRedirect) {
                    window.location.href = 'Cart.html';
                }
            });
        });
    }

    // ===== CART PAGE FUNCTIONALITY =====
    if (document.getElementById('cart-items')) {
        function renderCart() {
            const cartItemsContainer = document.getElementById('cart-items');
            const subtotalElement = document.getElementById('subtotal');
            const totalElement = document.getElementById('total');
            const shippingElement = document.getElementById('shipping');
            
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                subtotalElement.textContent = '$0.00';
                totalElement.textContent = '$10.00';
                return;
            }
            
            let subtotal = 0;
            
            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <p class="cart-item-size">Size: ${item.size}</p>
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            const shipping = 10.00;
            const total = subtotal + shipping;
            
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            shippingElement.textContent = `$${shipping.toFixed(2)}`;
            totalElement.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners for quantity changes
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    if (this.classList.contains('minus')) {
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                        } else {
                            cart.splice(index, 1);
                        }
                    } else {
                        cart[index].quantity++;
                    }
                    updateCart();
                });
            });
            
            // Add event listeners for remove buttons
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        }
        
        function updateCart() {
            localStorage.setItem('nikeCart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
        
        renderCart();
    }

    // ===== CHECKOUT PAGE =====
    if (document.getElementById('shippingForm')) {
        document.getElementById('shippingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Order placed successfully!');
            localStorage.removeItem('nikeCart');
            cart = [];
            updateCartCount();
            window.location.href = 'index.html';
        });
    }

    // ===== INITIALIZE =====
    updateCartCount();
});

// ===== RESPONSIVE DESIGN =====
function handleResponsiveElements() {
    // Product grid responsiveness
    const productGrids = document.querySelectorAll('.products-grid, .product-details-grid');
    productGrids.forEach(grid => {
        if (window.innerWidth < 480) {
            grid.style.gridTemplateColumns = '1fr';
        } else if (window.innerWidth < 768) {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        }
    });

    // Cart item responsiveness
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        if (window.innerWidth < 768) {
            item.style.gridTemplateColumns = '100px 1fr';
            item.style.gridTemplateRows = 'auto auto';
        }
    });
}

window.addEventListener('load', handleResponsiveElements);
window.addEventListener('resize', handleResponsiveElements);

// JScript.js - Complete Cart System for Nike Store

// Global Cart Variable
let cart = JSON.parse(localStorage.getItem('nikeCart')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }

    // ===== CART FUNCTIONALITY =====
    updateCartCount();

    // ===== PRODUCT DETAILS PAGE =====
    if (document.querySelector('.product-details')) {
        document.querySelectorAll('.buyButton').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.sliderItem');
                const product = {
                    id: productCard.querySelector('.sliderTitle').textContent.replace(/\s+/g, '-').toLowerCase(),
                    name: productCard.querySelector('.sliderTitle').textContent,
                    price: parseFloat(productCard.querySelector('.sliderPrice').textContent.replace('$', '')),
                    image: productCard.querySelector('.sliderImg').src,
                    size: productCard.querySelector('select').value,
                    quantity: 1
                };

                // Check if item exists in cart
                const existingItem = cart.find(item => 
                    item.id === product.id && item.size === product.size);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push(product);
                }

                localStorage.setItem('nikeCart', JSON.stringify(cart));
                updateCartCount();
                
                // Show confirmation
                const shouldRedirect = confirm(`${product.name} (Size: ${product.size}) added to cart!\n\nGo to cart now?`);
                if (shouldRedirect) {
                    window.location.href = 'Cart.html';
                }
            });
        });
    }

    // ===== CART PAGE =====
    if (document.getElementById('cart-items')) {
        renderCart();
    }
});

// ===== CART FUNCTIONS =====
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems > 0 ? totalItems : '';
    });
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const shippingElement = document.getElementById('shipping');
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        subtotalElement.textContent = '$0.00';
        totalElement.textContent = '$10.00';
        return;
    }
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-size">Size: ${item.size}</p>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">−</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-index="${index}">× Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    const shipping = 10.00;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners for quantity changes
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (this.classList.contains('minus')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
            } else {
                cart[index].quantity++;
            }
            updateCart();
        });
    });
    
    // Add event listeners for quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            const newQuantity = parseInt(this.value);
            if (newQuantity >= 1) {
                cart[index].quantity = newQuantity;
                updateCart();
            } else {
                this.value = cart[index].quantity;
            }
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCart();
        });
    });
}

function updateCart() {
    localStorage.setItem('nikeCart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// ===== RESPONSIVE HELPERS =====
function handleResponsiveElements() {
    // Adjust cart items for mobile
    const cartItems = document.querySelectorAll('.cart-item');
    if (window.innerWidth < 768 && cartItems.length > 0) {
        cartItems.forEach(item => {
            item.style.gridTemplateColumns = '100px 1fr';
            item.style.gridTemplateRows = 'auto auto auto';
        });
    }
}

window.addEventListener('resize', handleResponsiveElements);