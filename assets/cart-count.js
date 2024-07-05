// Function to update the cart count
function updateCartCount() {
  $.getJSON("/cart.js", function (cart) {
    let itemCount = cart.item_count;
    $("#cart-count").text(itemCount);
  });
}
// Initialize and set event listeners
$(document).ready(function () {
  // Update the cart count on page load
  updateCartCount();

  // Add an event listener to update the cart count when items are added to the cart
  $(document).on("click", ".buy-buttons .button", function (e) {
    e.preventDefault();
    let $this = $(this);
    let id = $('input[name="product-id"]').val();
    let formData = {
      items: [
        {
          id: id,
          quantity: 1,
        },
      ],
    };

    const productData = Object.values(selectedProducts).map((formData) => ({
      id: data.id,
      quantity: data.quantity,
    }));

    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      dataType: "json",
      data: formData,
      success: function (response) {
        updateCartCount();
        alert("Item added to cart!");
      },
      error: function () {
        alert("There was an error adding the item to the cart.");
      },
    });
  });
});
