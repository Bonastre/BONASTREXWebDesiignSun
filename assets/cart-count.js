$(document).ready(function () {
  function updateCartItemCount() {
    Shopify.cart.getCart(function (cart) {
      const itemCount = cart.item_count;
      const textElement = $("#cart-item-text");
      const text = itemCount === 1 ? "item is" : "items are";

      const dynamicText = itemCount + " " + text + " in your cart";

      textElement.text(dynamicText);
    });
  }

  updateCartItemCount();
  Shopify.onCartUpdate = updateCartItemCount;
});
