
document.addEventListener("DOMContentLoaded", function() {
  const list = document.getElementById("product-list");
  const cart = document.getElementById("cart");
  const slots = document.getElementById("slots");
  const checkout = document.getElementById("checkout");

  let cartItems = [];

  products.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `<h2>${p.name}</h2><p>${p.description}</p><p><strong>${p.price} €</strong></p>
    <button onclick="addToCart(${i})">Ajouter</button>`;
    list.appendChild(div);
  });

  window.addToCart = function(index) {
    cartItems.push(products[index]);
    renderCart();
  }

  function renderCart() {
    cart.innerHTML = "<h2>Panier</h2>";
    if (cartItems.length === 0) {
      cart.innerHTML += "<p>Votre panier est vide.</p>";
    } else {
      let total = 0;
      cartItems.forEach(item => {
        cart.innerHTML += `<p>${item.name} - ${item.price} €</p>`;
        total += item.price;
      });
      cart.innerHTML += `<hr><strong>Total : ${total.toFixed(2)} €</strong>`;
    }
  }

  // Créneaux horaires
  for (let h = 10; h <= 17; h++) {
    for (let m = 0; m < 60; m += 15) {
      const option = document.createElement("option");
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      option.text = `${hh}h${mm}`;
      slots.appendChild(option);
    }
  }

  checkout.onclick = () => {
    alert("Redirection vers Stripe Test...");
  };
});
