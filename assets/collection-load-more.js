jQuery(document).ready(function ($) {
  let loadMore = $("#load-more");
  let collection = $(".collection__main");
  let dataNextUrl = collection.data("next-url");

  if (dataNextUrl) {
    loadMore.on("click", function (event) {
      event.preventDefault();
      $.ajax({
        url: dataNextUrl,
        type: "GET",
        dataType: "html",
        success: function (nextPage) {
          let newProducts = $(nextPage).find(".product-card");
          collection.append(newProducts);
          collection.data(
            "next-url",
            $(nextPage).find(".pagination__next").data("url"),
          );
        },
      });
    });
  }
});
