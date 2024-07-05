jQuery(document).ready(function ($) {
  let buttons = document.querySelectorAll(".buy-buttons");
  buttons.forEach().on("click", function () {
    let parent = e.target.closest(".shopify-product-form");
    var obj = $(this);
    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: {
        quantity: 1,
        id: $(this).attr("data-variant"),
      },
      dataType: "json",
      success: function (data) {
        $.ajax({
          type: "GET",
          dataType: "json",
          url: "/cart.js",
          success: function (cart) {
            // once you get the data from AJAX API you need to get the latest count
            let total = cart.item_count;
            $(".header__product-count").html(total);
          },
        });
      },
    });
  });
});

/*
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
      const formData = {
        items: [
          {
            id: variantId,
            quantity: 1,
          },
        ],
      };

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          console.log(response);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          updateCartCount();
          alert("Item added to cart!");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          alert("There was an error adding the item to the cart.");
        });
    });
  });
});
*/
