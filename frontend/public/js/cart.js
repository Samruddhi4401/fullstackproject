const API_BASE_URL = "http://localhost:5000/api"; // Change if hosted elsewhere

// Load and display cart items
async function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-container");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  for (const item of cart) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${item.productId}`);
      const product = await res.json();

      const div = document.createElement("div");
      div.className = "col-md-4";
      div.innerHTML = `
        <div class="card h-100">
          <img src="${product.image}" class="card-img-top" style="height: 200px; object-fit: contain;" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">Price: ₹${product.price}</p>
            <p class="card-text">Quantity: ${item.quantity}</p>
            <p class="card-text">Subtotal: ₹${product.price * item.quantity}</p>
          </div>
        </div>
      `;
      container.appendChild(div);
    } catch (err) {
      console.error("Error loading product:", err);
      container.innerHTML += `<p>Error loading product ID: ${item.productId}</p>`;
    }
  }
}

// Show address input
function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const addressForm = document.getElementById("address-form");
  if (addressForm) {
    addressForm.classList.remove("d-none");
  } else {
    alert("Address form missing in HTML!");
  }
}

// Submit order to backend
async function submitOrder(event) {
  event.preventDefault();

  const rawCart = JSON.parse(localStorage.getItem("cart")) || [];
  const address = document.getElementById("delivery-address").value.trim();

  if (!address) {
    alert("❌ Please enter delivery address.");
    return;
  }

  // Fetch complete product data
  const items = [];
  for (const cartItem of rawCart) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${cartItem.productId}`);
      const product = await res.json();

      if (!product.name || product.price == null || cartItem.quantity == null) {
        alert("❌ Each item must have name, price, and quantity.");
        return;
      }

      items.push({
        name: product.name,
        price: Number(product.price),
        image: product.image || "",
        quantity: Number(cartItem.quantity)
      });
    } catch (err) {
      console.error("❌ Failed to fetch product:", cartItem.productId, err);
      alert("❌ Failed to fetch product details.");
      return;
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    items,
    address,
    totalAmount
  };

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      },
      body: JSON.stringify(order),
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      loadCart();
      document.getElementById("address-form").classList.add("d-none");
      document.getElementById("feedback-section").classList.remove("d-none");
    } else {
      alert("❌ Order failed: " + (result.error || result.message || "Unknown error"));
    }
  } catch (err) {
    console.error("❌ Order error:", err);
    alert("❌ Server error while placing order.");
  }
}

// Save user feedback
function submitFeedback(event) {
  event.preventDefault();

  const feedbackText = document.getElementById("feedback-text").value.trim();
  if (!feedbackText) return;

  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push({
    message: feedbackText,
    timestamp: new Date().toISOString()
  });

  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  alert("🙏 Thank you for your feedback!");

  document.getElementById("feedback-text").value = "";
  document.getElementById("feedback-section").classList.add("d-none");
}

// Load cart on page load
document.addEventListener("DOMContentLoaded", loadCart);
