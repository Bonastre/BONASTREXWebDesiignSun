document.addEventListener("DOMContentLoaded", () => {
  // Update the cart count on page load
  updateCartCount();

  // Add event listener to add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const variantId = e.target.getAttribute("data-variant-id");
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
