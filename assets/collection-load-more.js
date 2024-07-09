jQuery(document).ready(function ($) {
  let loadMore = $("#load-more");
  let collection = $(".collection__main");
  let dataNextUrl = collection.data("next-url");

  if (dataNextUrl) {
    loadMore.on("click", function (event) {
      event.preventDefault();
      $;.ajax({
        url: dataNextUrl,
        success: function (data) {
          collection.html(data);
          collection.data("next-url", $(data).find(".collection__main").data("next-url"));
          loadMore.remove();
        },
      });
    });
  }
});
