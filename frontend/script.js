// script.js
fetch("http://localhost:3000/api/products")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("product-list");
    data.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${product.name}</h3>
        <p>₹ ${product.retail_price}</p>
        <a href="product.html?id=${product.id}">View Details</a>
      `;
      container.appendChild(card);
    });
  })
  .catch(err => {
    document.getElementById("product-list").innerHTML = "<p>❌ Failed to load products</p>";
    console.error(err);
  });
