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
  var accordionsContainer = document.querySelector('.js-accordions');

  if (accordionsContainer !== null) {
    var accordions = accordionsContainer.querySelectorAll('.js-accordion');

    for (var i = 0; i < accordions.length; i++) {
      var accordion = accordions[i];

      var accordionTrigger = accordion.querySelector('.js-accordion-trigger');

      accordionTrigger.addEventListener('click', function (event) {
        event.preventDefault();
        this.closest('.js-accordion').classList.toggle('active');
      });
    }
  }

  const tabsBtn = document.querySelectorAll('.tabsNavBtn');
  const tabsItems = document.querySelectorAll('.tabsItem');

  if (tabsBtn !== null && tabsItems !== null) {

    tabsBtn.forEach(function (item) {
      item.addEventListener('click', function () {
        let currentBtn = item;
        let tabId = currentBtn.getAttribute('data-tab');
        let currentTab = document.querySelector(tabId);

        if (!currentBtn.classList.contains('tabsActive')) {
          tabsBtn.forEach(function (item) {
            item.classList.remove('tabsActive');
          });
          tabsItems.forEach(function (item) {
            item.classList.remove('tabsActive');
          });

          currentBtn.classList.add('tabsActive');
          currentTab.classList.add('tabsActive');
        }
      });
    });

    if (document.querySelector('.tabsNavBtn:nth-child(1)')) {
      document.querySelector('.tabsNavBtn:nth-child(1)').click();
    }
  }

  const newsletterPopup = document.querySelector('.NewsletterPopup');
  const newsletterPopupTrigger = document.querySelectorAll('.open-newsletter');

  if (newsletterPopup && newsletterPopupTrigger) {
    for (var i = 0; i < newsletterPopupTrigger.length; i++) {
      newsletterPopupTrigger[i].addEventListener('click', function (event) {
        event.preventDefault();
        newsletterPopup.setAttribute("aria-hidden", "false");
      });
    }
  }

  const $wishlistContainer = jQuery('#wishlist-container');
  const wishlistItems = JSON.parse(localStorage.getItem('wishlist-guest'));
  console.log(wishlistItems)
  if ($wishlistContainer.length) {
    let products = '';

    if (wishlistItems) {
        var date = new Date();
        var components = [
          date.getYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds(),
          date.getMilliseconds()
        ];

        for (var t = 0; t < wishlistItems.length; t++) {
          const product = wishlistItems[t];
          const key = Object.keys(product);

          if (key.length > 0) {
            products += product[key[0]] + ',';
          }
        }

        products = products.slice(0, -1);

        $wishlistContainer.load(window.routes.rootUrl + (window.routes.rootUrl.length > 1 ? '/' : '') + 'pages/wishlist-ajax' + '?products=' + products + '&type=' + components.join(""));

      $wishlistContainer.on('click', '.js-store-lists-add-wishlist', () => {
        setTimeout(() => {
          window.location.reload();
        }, 600);
      });
    }
  }

  if (!jQuery('.wishlist-user').length) {
   jQuery('.count-wishlist').html('(' + (wishlistItems == null ? 0 : wishlistItems.length) + ')');
  }

  jQuery('.js-store-lists-add-wishlist').click(function () {
    setTimeout(() => {
      if (theme.customer) {
        const app_obj = {
          namespace: 'wishlist',
          customerid: theme.customer_id,
          shop: theme.permanent_domain,
          domain: theme.domain,
          iid: theme.lists_app.iid
        }
        jQuery.ajax(
          {
            type: 'POST',
            url: 'https://' + theme.lists_app.url + '/api/getlist',
            data: app_obj,
            cache: !1,
            success: function (data) {
              jQuery('.count-wishlist').html('(' + data.count + ')');
            }
          }
        )
      } else {
        const wishlistItems = JSON.parse(localStorage.getItem('wishlist-guest'));
        jQuery('.count-wishlist').html('(' + (wishlistItems == null ? 0 : wishlistItems.length) + ')');
      }
    }, 600);
  });
});