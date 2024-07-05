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

function fetchConfig(type = "json") {
  const config = {
    method: "POST",
    headers: {
      "Content-Type":
        type === "json"
          ? "application/json"
          : "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };
  return config;
}

document.addEventListener("DOMContentLoaded", () => {
  // Update the cart count on page load
  updateCartCount();

  // Add event listener to add-to-cart buttons
  document.querySelectorAll(".buy-buttons").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const myCart =
        window.Shopify &&
        window.Shopify.Checkout &&
        window.Shopify.Checkout.Cart;

      const parent = e.target.closest(".shopify-product-form");

      const variantId = parent.querySelector("input[name='id']").value;
      const data = {
        items: [
          {
            id: variantId,
            quantity: 1,
          },
        ],
      };

      fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.status === 400) {
          alert("Please select a quantity");
        }
        return res.json();
      });

      const config = fetchConfig("javascript");
      config.headers["X-Requested-With"] = "XMLHttpRequest";
      delete config.headers["Content-Type"];

      // Create FormData
      const formData = new FormData();
      formData.append("id", variantId);
      formData.append("quantity", 1);
      if (myCart) {
        formData.append(
          "sections",
          myCart.getSectionsToRender().map((section) => section.id),
        );
        formData.append("sections_url", window.location.pathname);
      }

      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            console.error("Error:", response.description);
            return;
          } else if (!myCart) {
            window.location = window.routes.cart_url;
            return;
          }

          myCart.renderContents(response);
          myCart.classList.remove("is-empty");
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      const res = fetch("/cart.json");
      const cart = res.json();

      document.querySelectorAll(".cart-count-bubble").forEach((el) => {
        el.textContent = cart.item_count;
      });
    });
  });
});
