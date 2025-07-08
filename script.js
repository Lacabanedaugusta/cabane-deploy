// Initialisation Stripe avec la clé publique réelle
const stripe = Stripe("pk_live_51RdUoRHSB5Q9b2MrTeLXUJtP3KV..."); // Remplace si besoin

// Fonction pour récupérer le montant total du panier
function getTotalAmount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((total, item) => total + item.price, 0) * 100; // en centimes
}

// Gestion du bouton de paiement
document.getElementById("checkout").addEventListener("click", async () => {
  const amount = getTotalAmount();

  if (amount === 0) {
    alert("Votre panier est vide.");
    return;
  }

  try {
    // Appel à la Netlify Function pour créer un PaymentIntent
    const res = await fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();
    if (!data.clientSecret) {
      throw new Error("Erreur de création du paiement.");
    }

    // Stripe Elements pour le formulaire CB
    const elements = stripe.elements();
    const cardElement = elements.create("card");
    cardElement.mount("#card-element");

    // Masque le bouton de base
    document.getElementById("checkout").style.display = "none";

    // Crée le bouton "Valider le paiement"
    const payButton = document.createElement("button");
    payButton.textContent = "Valider le paiement";
    payButton.id = "pay-now";
    document.body.appendChild(payButton);

    // Quand on clique, on confirme le paiement
    payButton.addEventListener("click", async () => {
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        alert("Erreur : " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        alert("Paiement validé ✅ Merci !");
        localStorage.removeItem("cart");
        location.reload();
      }
    });
  } catch (err) {
    console.error(err);
    alert("Une erreur est survenue lors du paiement.");
  }
});
