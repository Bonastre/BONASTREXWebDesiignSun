// Function to get the wishlist from customer tags or localStorage
function getWishlist() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist === null) {
    wishlist = [];
  }
  return wishlist;
}

// Add to Wishlist Function
function addToWishlist(productId) {
  let wishlist = getWishlist();
  console.log(wishlist);

  if (productId && !wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to wishlist!");
  } else {
    alert(
      "This item is already in your wishlist or the product ID is invalid.",
    );
  }
}

// Remove from Wishlist Function
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

// Clear Wishlist Function
function clearWishlist() {
  localStorage.removeItem("wishlist");
  alert("Your wishlist has been cleared.");
}
