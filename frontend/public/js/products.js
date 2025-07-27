// Sample products list
const sampleProducts = [
  { _id: "1", name: "Tomato", price: 20, image: "img/tomato.jpg" },
  { _id: "2", name: "Potato", price: 15, image: "img/potato.jpg" },
  { _id: "3", name: "Carrot", price: 25, image: "img/carrot.jpg" },
  { _id: "4", name: "Onion", price: 18, image: "img/onion.jpg" },
  { _id: "5", name: "Cabbage", price: 22, image: "img/cabbage.jpg" },
  { _id: "6", name: "Broccoli", price: 30, image: "img/broccoli.jpg" },
  { _id: "7", name: "Spinach", price: 10, image: "img/spinach.jpg" },
  { _id: "8", name: "Capsicum", price: 28, image: "img/capsicum.jpg" },
  { _id: "9", name: "Cauliflower", price: 26, image: "img/cauliflower.jpg" },
  { _id: "10", name: "Green Peas", price: 35, image: "img/greenpea.jpeg" }
];

// Add product to cart
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item._id === product._id);

  if (existing) {
    alert("❌ Product already in cart!");
    return;
  }

  cart.push({ ...product, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Product added to cart!");
}

// Display product cards on page
function displayProducts() {
  const container = document.getElementById("products-container");

  if (!container) {
    console.error("❌ products-container element not found in DOM.");
    return;
  }

  container.innerHTML = ''; // Clear any existing content

  sampleProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "col-md-4 mb-4";

    // Using safe template literal
    div.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">Price: ₹${product.price}</p>
          <button class="btn btn-success w-100">Add to Cart</button>
        </div>
      </div>
      <script type="application/json" id="data-${product._id}">${JSON.stringify(product)}</script>
    `;

    div.querySelector("button").addEventListener("click", () => addToCart(product));
    container.appendChild(div);
  });
}

// Call display function on page load
document.addEventListener("DOMContentLoaded", displayProducts);
