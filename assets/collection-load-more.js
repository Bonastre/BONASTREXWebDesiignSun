jQuery(document).ready(function ($) {
  let loadMore = $("#load-more");
  let collection = $(".product-list");
  let nextUrl = collection.data("next-url");

  if (nextUrl) {
    loadMore.on("click", function (event) {
      event.preventDefault();
      $.ajax({
        url: nextUrl,
        type: "GET",
        dataType: "html",
        success: function (nextPage) {
          let newProducts = $(nextPage).find(".product-list");
          collection.append(newProducts.html());
          let newUrl = newProducts.data("next-url");
          let productCard = $(".product-card");
          productCard.css;
          nextUrl = newUrl;
          if (!newUrl) {
            loadMore.remove();
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
          loadMore.remove();
        },
      });
    });
  }
});
