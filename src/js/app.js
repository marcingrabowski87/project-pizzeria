/* "test:html": "globstar nu-html-checker dist/*.html", */
import {
  Product
} from './components/Product.js';

import {
  Cart
} from './components/Cart.js';
import {
  select,
  settings
} from './settings.js';


const app = {

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      /* new Product(productData, thisApp.data.products[productData]); */
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);

    }
  },
  initData: function () {
    const thisApp = this;
    /*  thisApp.data = dataSource; */
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        /*  console.log('parsedResponse', parsedResponse); */
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });

  },
  initCart: function () {
    const thisApp = this;
    const cartElement = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElement);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });

  },

  initPages: function () {
    const thisApp = this;
    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    thisApp.activePage(thisApp.pages[0].id);
  },




  init: function () {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initData();
    /* thisApp.initMenu(); */
    thisApp.initCart();

    /*  console.log('****App starting***');
     console.log('thisApp', thisApp);
     console.log('ClassNames', classNames);
     console.log('setings', settings);
     console.log('templates', templates); */

  },
};

app.init();
