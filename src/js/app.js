/* eslint-disable no-undef */
/* "test:html": "globstar nu-html-checker dist/*.html", */
import {
  Product
} from './components/Product.js';

import {
  Cart
} from './components/Cart.js';
import {
  select,
  settings,

  classNames
} from './settings.js';

import {
  Booking
} from './components/Booking.js';

/* import {
  dataSource
} from './data.js';*/
const app = {

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      /*  new Product(productData, thisApp.data.products[productData]); */
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);

    }
  },
  initData: function () {
    const thisApp = this;
    /* thisApp.data = dataSource; */
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {

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
    thisApp.pages = Array.from(document.body.querySelector(select.containerOf.pages).children);

    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    /* thisApp.activePage(thisApp.pages[0].id); */
    let pagesMatchingHash = [];
    if (window.location.hash.length > 2) {
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter(function (page) {
        return page.id === idFromHash;
      });

    }

    thisApp.activePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (e) {
        const clickedElement = this;
        e.preventDefault();
        thisApp.activePage(clickedElement.getAttribute('href').replace('#', ''));
      });
    }
  },

  activePage(pageId) {
    const thisApp = this;
    for (let link of thisApp.navLinks) {

      link.classList.toggle(classNames.nav.active, link.getAttribute('href') === '#' + pageId);
    }
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.nav.active, page.id === pageId);
    }

    window.location.hash = '#/' + pageId;
  },

  initBooking() {
    /*  const thisApp = this; */
    const containerBooking = document.querySelector(select.containerOf.booking);
    new Booking(containerBooking);
  },


  init: function () {
    const thisApp = this;
    thisApp.initPages();
    thisApp.initData();
    /* thisApp.initMenu();  */
    thisApp.initCart();
    thisApp.initBooking();

    /*  console.log('****App starting***');
     console.log('thisApp', thisApp);
     console.log('ClassNames', classNames);
     console.log('setings', settings);
     console.log('templates', templates); */

  },
};

app.init();
