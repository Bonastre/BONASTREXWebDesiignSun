document.addEventListener("DOMContentLoaded", function () {
  const tabsBtn = document.querySelectorAll(".tabsNavBtn");
  const tabsItems = document.querySelectorAll(".tabsItem");

  if (tabsBtn !== null && tabsItems !== null) {
    tabsBtn.forEach(function (item) {
      item.addEventListener("click", function () {
        let currentBtn = item;
        let tabId = currentBtn.getAttribute("data-tab");
        let currentTab = document.querySelector(tabId);

        if (!currentBtn.classList.contains("tabsActive")) {
          tabsBtn.forEach(function (item) {
            item.classList.remove("tabsActive");
          });
          tabsItems.forEach(function (item) {
            item.classList.remove("tabsActive");
          });

          currentBtn.classList.add("tabsActive");
          currentTab.classList.add("tabsActive");
        }
      });
    });

    if (document.querySelector(".tabsNavBtn:nth-child(1)")) {
      document.querySelector(".tabsNavBtn:nth-child(1)").click();
    }
  }
});
