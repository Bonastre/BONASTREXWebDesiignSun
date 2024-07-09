document.addEventListener('DOMContentLoaded', function() {
    var loadMoreButton = document.getElementById('load-more');
    var productGrid = document.getElementById('product-grid');
    var currentPage = 1;
    var totalPages = {{ collection.pages }};

    loadMoreButton.addEventListener('click', function() {
        currentPage++;

        if (currentPage <= totalPages) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/collections/{{ collection.handle }}?page=' + currentPage, true);
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(xhr.responseText, 'text/html');
                    var newProducts = doc.querySelectorAll('.product-card');

                    newProducts.forEach(function(product) {
                        productGrid.appendChild(product);
                    });

                    if (currentPage >= totalPages) {
                        loadMoreButton.style.display = 'none';
                    }
                }
            };
            xhr.send();
        }
    });
});