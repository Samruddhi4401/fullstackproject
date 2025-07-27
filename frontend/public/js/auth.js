// 🔗 Base URL of your backend
const API_BASE_URL = "http://localhost:5000/api"; // Update if deployed

// ✅ Signup Logic
document.getElementById("signupForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value; // Add this if you use role

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }), // include role if needed
    });

    const data = await response.json();

    if (response.ok) {
      alert("Signup successful! Please log in.");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Signup failed.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong. Please try again later.");
  }
});

// ✅ Login Logic
document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token); // Save JWT token
      localStorage.setItem("user", JSON.stringify(data.user)); // Save user info
      alert("Login successful!");
      window.location.href = "products.html"; // Redirect to products
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
});

// ✅ Logout Logic
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
