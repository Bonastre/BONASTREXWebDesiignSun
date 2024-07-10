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
          let productCards = $(".product-card");

          productCards.attr("style", "opacity: 1;");
          productCards.each((index, product) => {
            if ((index + 1) % 10 === 5) {
              $(product).addClass("fifth-product");
            }
          });

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
