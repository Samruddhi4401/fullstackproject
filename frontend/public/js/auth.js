// 🔗 Base URL of your backend
const API_BASE_URL = "https://fullstackproject-bh7s.onrender.com";

// ✅ Signup Logic
document.getElementById("signupForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role")?.value || "user"; // default to 'user'

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Signup successful! Please log in.");
      window.location.href = "login.html";
    } else {
      alert(`❌ Signup failed: ${data.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("❌ Signup error:", error);
    alert("🚨 Something went wrong. Please try again later.");
  }
});

// ✅ Login Logic
document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);         // JWT token
      localStorage.setItem("user", JSON.stringify(data.user)); // User info
      alert("✅ Login successful!");
      window.location.href = "products.html"; // Redirect to main page
    } else {
      alert(`❌ Login failed: ${data.message || "Invalid credentials"}`);
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    alert("🚨 Something went wrong. Please try again later.");
  }
});

// ✅ Logout Logic
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  alert("👋 Logged out successfully!");
  window.location.href = "index.html";
}
