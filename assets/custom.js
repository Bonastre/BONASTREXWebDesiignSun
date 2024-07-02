document.addEventListener("DOMContentLoaded", function () {
  const wishlistButtons = document.querySelectorAll(".wishlist-button");
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  let customer = null;

  // Function to fetch customer data
  function fetchCustomerData() {
    return fetch("/account.json", {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        customer = data.customer; // Assuming customer data includes ID or other identifier
      })
      .catch((error) => console.error("Error fetching customer data:", error));
  }

  // Fetch customer data when DOM is ready
  fetchCustomerData();

  // Function to update wishlist display
  function updateWishlistDisplay() {
    wishlistItemsContainer.innerHTML = "";
    if (customer && customer.metafields && customer.metafields.wishlist) {
      const wishlist = JSON.parse(customer.metafields.wishlist);
      wishlist.forEach((item) => {
        const product = window.allProducts[item.id];
        if (product) {
          const productElement = document.createElement("div");
          productElement.innerHTML = `
            <a href="${product.url}">
              <img src="${product.image}" alt="${product.title}" />
              <span>${product.title}</span>
            </a>`;
          wishlistItemsContainer.appendChild(productElement);
        }
      });
    }
  }

  // Function to add to wishlist
  function addToWishlist(productId) {
    if (!customer) {
      console.error("Customer not logged in.");
      return;
    }

    // Retrieve existing wishlist or initialize if empty
    let wishlist = [];
    if (customer.metafields && customer.metafields.wishlist) {
      wishlist = JSON.parse(customer.metafields.wishlist);
    }

    // Check if product already exists in wishlist
    if (wishlist.find((item) => item.id === productId)) {
      console.log("Product already in wishlist.");
      return;
    }

    // Add product to wishlist
    wishlist.push({ id: productId });

    // Update customer metafield with new wishlist data
    fetch(`/account`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          id: customer.id,
          metafields: {
            wishlist: JSON.stringify(wishlist),
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Wishlist updated:", data);
        updateWishlistDisplay();
      })
      .catch((error) => console.error("Error updating wishlist:", error));
  }

  // Attach click event listeners to wishlist buttons
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = button.getAttribute("data-product-id");
      addToWishlist(productId);
    });
  });

  // Update wishlist display initially
  updateWishlistDisplay();
});
