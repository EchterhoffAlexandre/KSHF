const app = {
  init: function () {
    user.init();
    quest.init();
    shop.init();
    // family.init();
  },
}

document.addEventListener('DOMContentLoaded', app.init);