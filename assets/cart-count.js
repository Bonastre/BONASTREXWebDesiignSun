function updateCartCount() {
  fetch("/cart.js")
    .then(function (response) {
      return response.json();
    })
    .then(function (cart) {
      if (cart.item_count == 0) {
        document.querySelector(".cart-count").innerHTML = "";
      } else {
        document.querySelector(".cart-count").innerHTML = cart.item_count;
      }
    });
}

setInterval(updateCartCount, 1000);
