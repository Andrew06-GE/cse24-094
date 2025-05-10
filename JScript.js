// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get the mobile menu button and the navbar menu
    const mobileMenuButton = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    // Add an event listener to the mobile menu button
    mobileMenuButton.addEventListener('click', function() {
        // Toggle the 'active' class to show/hide the menu
        navbarMenu.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the mobile menu button and the navbar menu
    const mobileMenuButton = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    // Add an event listener to the mobile menu button
    mobileMenuButton.addEventListener('click', function() {
        // Toggle the 'active' class to show/hide the menu
        navbarMenu.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.sliderItem');
    let currentSliderIndex = 0;

    // Function to show the current slider item
    function showSlider(index) {
        // Hide all sliders
        sliders.forEach((slider, i) => {
            if (i === index) {
                slider.style.display = 'block';
            } else {
                slider.style.display = 'none';
            }
        });
    }

    // Initially show the first slider
    showSlider(currentSliderIndex);

    // Set up the auto slider (optional)
    setInterval(function() {
        currentSliderIndex = (currentSliderIndex + 1) % sliders.length;
        showSlider(currentSliderIndex);
    }, 5000); // Change every 5 seconds

    // Add event listeners for the "BUY NOW!" buttons
    const buyButtons = document.querySelectorAll('.buyButton');
    buyButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Redirect to the product details page (you can replace this URL)
            window.location.href = `Product-Details.html?product=${index}`;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Select all "BUY NOW!" buttons
    const buyButtons = document.querySelectorAll('.buyButton');
    
    // Select cart count element to update
    const cartCountElement = document.getElementById('cart-count'); 

    // Update cart count from localStorage
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartCountElement.textContent = cartItems.length; // Display the number of items in the cart
    }

    // Add product to cart when the "BUY NOW!" button is clicked
    buyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productSize = this.previousElementSibling.value; // Get selected size

            // Create a product object
            const product = {
                name: productName,
                price: productPrice,
                size: productSize
            };

            // Retrieve cart items from localStorage
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            // Check if the product already exists in the cart, if so, increase its quantity
            let productExists = false;
            cartItems.forEach(item => {
                if (item.name === product.name && item.size === product.size) {
                    item.quantity++;
                    productExists = true;
                }
            });

            // If the product doesn't exist in the cart, add it
            if (!productExists) {
                product.quantity = 1;
                cartItems.push(product);
            }

            // Save updated cart items to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Update cart count in navbar
            updateCartCount();
        });
    });

    // Call updateCartCount on page load to ensure the cart count is correct
    updateCartCount();
});

document.addEventListener("DOMContentLoaded", function () {
    // Get the form and the form elements
    const feedbackForm = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Handle form submission
    feedbackForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        // Get form data
        const name = nameInput.value;
        const email = emailInput.value;
        const message = messageInput.value;

        // Basic form validation
        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        // If the form is valid, show a success message and clear the form
        alert("Thank you for your feedback, " + name + "! We will get back to you soon.");

        // Clear form after submission
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");
    const cartCountElement = document.getElementById("cart-count");

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `<p>Your cart is empty.</p>`;
        return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = ""; // Clear cart items container before reloading

    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <p><strong>${item.name}</strong> (Size: ${item.size})</p>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(itemDiv);

        // Calculate subtotal
        subtotal += item.price * item.quantity;
    });

    // Update subtotal, shipping, and total
    const shipping = 10.00; // Fixed shipping fee
    const total = subtotal + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Update the cart count in the navbar
    cartCountElement.textContent = cartItems.length;

    // Add event listeners for the "Remove" buttons
    const removeButtons = document.querySelectorAll(".remove-item");
    removeButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            const index = event.target.getAttribute("data-index");
            cartItems.splice(index, 1); // Remove item from the cart array

            // Save the updated cart array in localStorage
            localStorage.setItem("cartItems", JSON.stringify(cartItems));

            // Reload the cart page
            location.reload(); // Reload the page to reflect changes
        });
    });
});
// Inside the remove button event listener:
button.addEventListener("click", function (event) {
    const index = event.target.getAttribute("data-index");
    cartItems.splice(index, 1); // Remove item from the cart array

    // Save the updated cart array in localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Remove the item div from the DOM
    itemDiv.remove();

    // Recalculate the subtotal, total, etc.
    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const shipping = 10.00;
    const total = subtotal + shipping;

    // Update the summary
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;

    // Update the cart count
    cartCountElement.textContent = cartItems.length;
});
