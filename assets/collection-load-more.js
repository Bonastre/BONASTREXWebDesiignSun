jQuery(document).ready(function ($) {
  let loadMore = $("#load-more");
  let collection = $(".collection__main");
  let nextUrl = collection.data("next-url");

  if (nextUrl) {
    loadMore.on("click", function (event) {
      event.preventDefault();
      $.ajax({
        url: nextUrl,
        type: "GET",
        dataType: "html",
        success: function (nextPage) {
          let newProducts = $(nextPage).find(".collection__main");
          collection.append(newProducts.html());
          let nextUrl = newProducts.data("next-url");
          nextUrl = newUrl;
        },
      });
    });
  }
});
