jQuery(document).ready(function ($) {
  let loadMore = $("#load-more");
  let collection = $(".collection__main");
  let dataNextUrl = collection.data("next-url");

  if (dataNextUrl) {
    loadMore.on("click", function (event) {
      event.preventDefault();
      collection.load(dataNextUrl);
    });
  }
});
