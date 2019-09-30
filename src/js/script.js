/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
/* "test:html": "globstar nu-html-checker dist/*.html", */
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

  /* const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    } */
  /* }; */

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
  class Product {
    constructor(id, data) {
      this.id = id;
      this.data = data;
      const thisProduct = this;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();

    }
    renderInMenu() {
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);

    }
    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);



    }

    initAccordion() {
      const thisProduct = this;


      thisProduct.accordionTrigger.addEventListener('click', function (e) {
        e.preventDefault();

        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        const ProductsActive = document.querySelectorAll('#product-list .product.active');

        for (let actualProduct of ProductsActive) {
          if (actualProduct !== thisProduct.element) {

            actualProduct.classList.remove('active');
          }
        }

      });
    }
    initOrderForm() {
      const thisProduct = this;


      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.prcessOrder();
      });
      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();

        });
      }
      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
    processOrder() {

      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      /* console.log(formData); */

      let price = thisProduct.data.price;
    
      
      for (let paramId in thisProduct.data.params) {

        

        for (let optionId in thisProduct.data.params[paramId].options) {


          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          /* console.log(optionSelected); */
          const option = {
            optionId: thisProduct.data.params[paramId].options
          };

          let chooseProductPrice = option.optionId[optionId].price;

          if (optionSelected && !option.defualt) {
            price += chooseProductPrice;

          } else if (option.optionId[optionId].default) {
            price -= chooseProductPrice;

          }
let images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

if(optionSelected){

console.log(images);
for (let image of images)
{
  image.classList.add('active');
}

        }
        else{
          for (let image of images)
{
  image.classList.remove('active');
}
        }
         

        }
      
      }

      thisProduct.priceElem.innerHTML = price;
    }




  }
  const app = {

    initMenu: function () {
      const thisApp = this;

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
      thisApp.initData();
      thisApp.initMenu();

    },
  };

  app.init();
}
