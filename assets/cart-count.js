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
    console.log(button);
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const variantId = document.querySelector(
        "input [name='product-id']",
      ).value;
      const formData = {
        items: [
          {
            id: variantId,
            quantity: 1,
          },
        ],
      };

      console.log(formData);

      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
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
