function updateCartCount() {
  fetch("/cart.js")
    .then(function (response) {
      return response.json();
    })
    .then(function (cart) {
      // Update the cart item count on the page
      document.querySelector(".cart-count").innerHTML = cart.item_count;
    });
}

setInterval(updateCartCount, 1000);
