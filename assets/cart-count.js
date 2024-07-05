

function updateCartCount() {
  fetch("/cart.js")
    .then((response) => response.json())
    .then((data) => {
      const counterEls = document.querySelectorAll(".js-cart-item-count");
      counterEls.forEach((element) => {
        element.innerHTML = data.item_count;
      });
    })
    .catch((error) => {
      console.error("Error fetching cart data:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Update the cart count on page load
  updateCartCount();

  // Add event listener to add-to-cart buttons
  document.querySelectorAll(".buy-buttons").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const parent = e.target.closest(".shopify-product-form");

      const variantId = parent.querySelector("input[name='product-id']").value;
      
  });
});
