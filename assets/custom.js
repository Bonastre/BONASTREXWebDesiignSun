/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

document.addEventListener("DOMContentLoaded", function () {
  const $wishlistContainer = jQuery("#wishlist-container");
  const wishlistItems = JSON.parse(localStorage.getItem("wishlist-guest"));
  console.log(wishlistItems);
  if ($wishlistContainer.length) {
    let products = "";

    if (wishlistItems) {
      var date = new Date();
      var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      ];

      for (var t = 0; t < wishlistItems.length; t++) {
        const product = wishlistItems[t];
        const key = Object.keys(product);

        if (key.length > 0) {
          products += product[key[0]] + ",";
        }
      }

      products = products.slice(0, -1);

      $wishlistContainer.load(
        window.routes.rootUrl +
          (window.routes.rootUrl.length > 1 ? "/" : "") +
          "pages/wishlist-ajax" +
          "?products=" +
          products +
          "&type=" +
          components.join(""),
      );

      $wishlistContainer.on("click", ".js-store-lists-add-wishlist", () => {
        setTimeout(() => {
          window.location.reload();
        }, 600);
      });
    }
  }

  if (!jQuery(".wishlist-user").length) {
    jQuery(".count-wishlist").html(
      "(" + (wishlistItems == null ? 0 : wishlistItems.length) + ")",
    );
  }

  jQuery(".js-store-lists-add-wishlist").click(function () {
    setTimeout(() => {
      if (theme.customer) {
        const app_obj = {
          namespace: "wishlist",
          customerid: theme.customer_id,
          shop: theme.permanent_domain,
          domain: theme.domain,
          iid: theme.lists_app.iid,
        };
        jQuery.ajax({
          type: "POST",
          url: "https://" + theme.lists_app.url + "/api/getlist",
          data: app_obj,
          cache: !1,
          success: function (data) {
            jQuery(".count-wishlist").html("(" + data.count + ")");
          },
        });
      } else {
        const wishlistItems = JSON.parse(
          localStorage.getItem("wishlist-guest"),
        );
        jQuery(".count-wishlist").html(
          "(" + (wishlistItems == null ? 0 : wishlistItems.length) + ")",
        );
      }
    }, 600);
  });
});
