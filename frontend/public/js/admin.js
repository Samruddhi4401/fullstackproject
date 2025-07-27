document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-product-form");
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const stockInput = document.getElementById("stock");
  const imageInput = document.getElementById("image");
  const msgBox = document.getElementById("adminMsgBox");

  if (!form || !nameInput || !priceInput || !stockInput || !imageInput || !msgBox) {
    console.error("❌ Required form elements not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value.trim());
    const stock = parseInt(stockInput.value.trim());
    const imageFile = imageInput.files[0];

    // 🔍 Basic validation
    if (!name || isNaN(price) || isNaN(stock) || !imageFile) {
      showMessage("❌ All fields are required!", true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showMessage("❌ You must be logged in as admin!", true);
      return;
    }

    try {
      const base64Image = await convertToBase64(imageFile);
      const productData = { name, price, stock, image: base64Image };

      const response = await fetch("https://fullstackproject-bh7s.onrender.com/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        showMessage("✅ Product added successfully!");
        form.reset();
        if (typeof loadProducts === "function") loadProducts(); // Optional product reload
      } else {
        const errMsg = result?.message || "❌ Server failed to add product.";
        showMessage(errMsg, true);
        console.error("🔴 Server Response:", result);
      }
    } catch (err) {
      console.error("🔴 Error:", err.message);
      showMessage("❌ Error adding product: " + err.message, true);
    }
  });

  // 🔧 Convert image file to base64 string
  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("❌ Failed to read image."));
      reader.readAsDataURL(file);
    });
  }

  // 📢 Display success or error messages
  function showMessage(msg, isError = false) {
    msgBox.textContent = msg;
    msgBox.className = `alert ${isError ? "alert-danger" : "alert-success"} text-center`;
    msgBox.style.display = "block";

    setTimeout(() => {
      msgBox.style.display = "none";
    }, 4000);
  }
});
