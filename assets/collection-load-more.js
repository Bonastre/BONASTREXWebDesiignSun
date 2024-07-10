jQuery(document).ready(function ($) {
  let loadMore = $("#load-more");
  let collection = $(".product-list");
  let nextUrl = collection.data("next-url");

  let fifthProduct = $(".product-card:nth-child(5)");

  if (fifthProduct) {
    fifthProduct.addClass("fifth-product");
  }

  if (nextUrl) {
    loadMore.on("click", function (event) {
      event.preventDefault();
      $.ajax({
        url: nextUrl,
        type: "GET",
        dataType: "html",
        success: function (nextPage) {
          let newProducts = $(nextPage).find(".product-list");
          let newUrl = newProducts.data("next-url");
          let productCard = $(".product-card");
          let fifthProduct = $(".product-card:nth-child(5)");
          if (fifthProduct) {
            fifthProduct.addClass("fifth-product");
          }
          collection.append(newProducts.html());
          productCard.attr("style", "opacity: 1;");
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
