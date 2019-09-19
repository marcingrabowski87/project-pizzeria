/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
  class Product {
    constructor(id, data) {
      this.id = id;
      this.data = data;
      const thisProduct = this;
      thisProduct.renderInMenu();
      thisProduct.initAccordion();
      /* console.log('new Product:', thisProduct); */
    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
      /* console.log(menuContainer); */
    }
    initAccordion() {
      const thisProduct = this;
      const accordionButton = document.querySelectorAll(select.menuProduct.clickable);
      const boxForProducts = document.querySelectorAll('#product-list > .product');
      /* console.log(accordionButton); */

      for (let x of accordionButton) {
        /* console.log(x); */
        x.addEventListener('click', function (e) {
          const ProductsActive = document.querySelectorAll('#product-list .product.active');
          console.log("x", thisProduct.element);
          for (let y of ProductsActive) {
            if (thisProduct.element === y)
              console.log("y=", y);
          }
          /*  console.log(ProductsActive); */
          e.preventDefault();
          /*  console.log(this.id); */
          /* console.log("boxForProducts", boxForProducts); */
          thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);


          /* thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive); */
          /* console.log(thisProduct.element); */

          /* console.log(x.parentElement); */

        });
      }
    }

  }



  const app = {

    initMenu: function () {
      const thisApp = this;
      /* console.log('thisApp.data', thisApp.data); */
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);

      }
    },
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    init: function () {
      const thisApp = this;
      /* console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates); */
      thisApp.initData();
      thisApp.initMenu();

    },
  };

  app.init();

}
