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
          collection.append(newProducts.html());
          let newUrl = newProducts.data("next-url");
          let productCards = $(".product-card");

          productCards.attr("style", "opacity: 1;");
          productCards.each((product, index) => {
            console.log(product);
            //console.log(index % 10);
            if (index % 10 === 5) {
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
