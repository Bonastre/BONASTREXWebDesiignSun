// Function to get the wishlist from localStorage
function getWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist;
}

// Function to add to wishlist
function addToWishlist(productId) {
  let wishlist = getWishlist();
  if (productId && !wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to wishlist!");
  } else {
    removeFromWishlist(productId);
  }
}

// Function to remove from wishlist
function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Removed from wishlist!");
    if (wishlist.length === 0) {
      alert("Your wishlist is now empty.");
    }
  } else {
    alert("This item is not in your wishlist.");
  }
}

// Function to clear wishlist
function clearWishlist() {
  localStorage.removeItem("wishlist");
  alert("Your wishlist has been cleared.");
}

// Function to display wishlist items
function displayWishlist() {
  let wishlist = getWishlist();
  if (wishlist.length === 0) {
    document.getElementById("wishlist-content").innerHTML =
      "<p>Your wishlist is empty.</p>";
  } else {
    let wishlistContent = "";
    wishlist.forEach(function (productId) {
      let product = window.allProducts[productId];
      if (product) {
        wishlistContent += `<div class="wishlist-item">
                    <a href="${product.url}">${product.title}</a>
                    <img src="${product.image}" alt="${product.title}" />
                    <button onclick="removeFromWishlist(${product.id})">Remove</button>
                </div>`;
      }
    });
    document.getElementById("wishlist-content").innerHTML = wishlistContent;
  }
}

// Call displayWishlist on page load
document.addEventListener("DOMContentLoaded", function () {
  displayWishlist();
});
