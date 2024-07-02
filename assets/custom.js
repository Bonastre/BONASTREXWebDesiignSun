document.addEventListener("DOMContentLoaded", function () {
  const wishlistButtons = document.querySelectorAll(".wishlist-button");
  const wishlistItemsContainer = document.getElementById("wishlist-items");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  function updateWishlistDisplay() {
    wishlistItemsContainer.innerHTML = "";
    wishlist.forEach((item) => {
      const productElement = document.createElement("div");
      productElement.innerHTML = `<a href="/products/${item.handle}">${item.title}</a>`;
      wishlistItemsContainer.appendChild(productElement);
    });
  }

  function addToWishlist(productId, productTitle, productHandle) {
    const product = {
      id: productId,
      title: productTitle,
      handle: productHandle,
    };
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistDisplay();
  }

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = button.getAttribute("data-product-id");
      const productTitle = button.getAttribute("data-product-title");
      const productHandle = button.getAttribute("data-product-handle");
      addToWishlist(productId, productTitle, productHandle);
    });
  });

  updateWishlistDisplay();
});
