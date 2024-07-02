function addToWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
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
function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
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
