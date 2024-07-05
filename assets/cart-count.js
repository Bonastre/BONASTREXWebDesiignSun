// Function to update the cart count
// Initialize and set event listeners
$(document).ready(function () {
  function updateCartCount() {
    $.getJSON("/cart.js", function (cart) {
      var itemCount = cart.item_count;
      $("#cart-count").text(itemCount);
    });
  }

  // Update the cart count on page load
  updateCartCount();

  // Add an event listener to update the cart count when items are added to the cart
  $(document).on("click", ".buy-buttons .button", function (e) {
    e.preventDefault();
    var $this = $(this);
    let id = $this.data("variant-id");
    var formData = {
      items: [
        {
          id: $this.data("variant-id"),
          quantity: 1,
        },
      ],
    };

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
