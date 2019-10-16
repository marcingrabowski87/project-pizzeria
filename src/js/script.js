/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
/* "test:html": "globstar nu-html-checker dist/*.html", */
{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product',
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
        input: 'input.amount',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      toatalNumber: '.cart__total-number',
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name=address]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    cart: {
      wrapperActive: 'active',
    }
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    },
    cart: {
      defaultDeliveryFee: 20,
    },

    db: {
      url: '//localhost:3131',
      product: 'product',
      order: 'order',
    },
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
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
      thisProduct.initAmountWidget();
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
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);


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
        thisProduct.addToCart();
      });
    }
    processOrder() {

      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      /*
            console.log(formData); */
      thisProduct.params = {};
      let price = thisProduct.data.price;


      for (let paramId in thisProduct.data.params) {

        let param = thisProduct.data.params[paramId];
        /*  console.log('param', param); */

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
          const images = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);

          if (optionSelected) {
            if (!thisProduct.params[paramId]) {
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.optionId[optionId].label;
            for (let image of images) {

              image.classList.add('active');
            }

          } else {
            for (let image of images) {
              image.classList.remove('active');
            }
          }
        }

      }
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = thisProduct.price;
      /* price *= thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price; */
      /*  console.log(thisProduct.params); */
    }
    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmoungWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function () {
        /* console.log('thisProduct.amountWidgetElem', thisProduct.amountWidgetElem); */
        thisProduct.processOrder();
      });
    }
    addToCart() {
      const thisProduct = this;
      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;
      app.cart.add(thisProduct);
    }


  }

  class AmoungWidget {

    constructor(element) {

      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
      /*  console.log("AmoungWidget", thisWidget);
       console.log("constructor argument", element); */
    }
    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrase = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      thisWidget.input.value = settings.amountWidget.defaultValue;

    }
    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);


      if (newValue !== parseInt(thisWidget.value) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }



      thisWidget.input.value = thisWidget.value;
    }
    initActions() {


      const thisWidget = this;

      thisWidget.input.addEventListener('change', function (e) {
        e.preventDefault();



        thisWidget.setValue(thisWidget.input.value);

      });

      thisWidget.linkDecrease.addEventListener('click', function (e) {

        e.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);

      });

      thisWidget.linkIncrase.addEventListener('click', function (e) {


        e.preventDefault();
        thisWidget.setValue(parseInt(thisWidget.value) + 1);

      });

    }
    announce() {
      const thisWidget = this;
      /* const event = new Event('updated'); */
      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }
  class Cart {
    constructor(element) {

      const thisCart = this;
      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();
      /* thisCart.deliveryFee = settings.cart.defaultDeliveryFee; */
      /* console.log('new cart', thisCart); */

    }
    getElements(element) {

      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      /*  console.log('thisCart.dom', thisCart.dom);
       console.log('element', element); */
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.renderTotalKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
      for (let key of thisCart.renderTotalKeys) {
        thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
      }
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    }
    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
        thisCart.dom.productList.addEventListener('updated', function () {
          thisCart.update();
        });
      });

      thisCart.dom.productList.addEventListener('remove', function () {
        thisCart.remove(event.detail.cartProduct);

        thisCart.update();
      });
      thisCart.dom.form.addEventListener('submit', function (e) {
        e.preventDefault();
        thisCart.senderOrder();
      });
    }
    senderOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.order;
      const payload = {
        phone: thisCart.dom.phone,
        address: thisCart.dom.address,
        totalNumber: thisCart.totalNumber,
        subtotalPrice: thisCart.subtotalPrice,
        totalPrice: thisCart.totalPrice,
        deliveryFee: thisCart.deliveryFee,
        products: [],
      };
      for (let item of thisCart.products) {

        payload.products.push(thisCart.getData(item));
      }


      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),

      };
      fetch(url, options)
        .then(function (response) {
          return response.json();
        })
        .then(function (parsedResponse) {
          console.log('parsedResponse', parsedResponse);
        });


    }

    getData(item) {

      return {
        id: item.id,
        amount: item.amount,
        price: item.price,
        singlePrice: item.priceSingle,
        params: item.params,
      };
    }



    remove(cartProduct) {
      const thisCart = this;
      /* console.log(thisCart);
      console.log(cartProduct); */
      const index = thisCart.products.indexOf(cartProduct); /* tutaj pisać  */
      thisCart.products.splice(index, 1);

    }
    add(menuProduct) {

      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);

      const generatedDom = utils.createDOMFromHTML(generatedHTML);

      thisCart.dom.productList.appendChild(generatedDom);


      thisCart.products.push(new CartProduct(menuProduct, generatedDom));
      /*  console.log('thisCart.products', thisCart.products); */

      /*  console.log('adding product', menuProduct); */
      thisCart.update();
    }
    /* Add the price in the basket*/
    update() {
      const thisCart = this;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      for (let singleProduct of thisCart.products) {

        thisCart.subtotalPrice += singleProduct.price;
        thisCart.totalNumber += singleProduct.amount;
      }
      /*  console.log('Produkty przed petlą', thisCart.products); */
      if (thisCart.products.length === 0) {
        /* console.log(thisCart.products.length); */
        thisCart.deliveryFee = 0;
        thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      } else {
        thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
        thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      }

      /* console.log(thisCart.totalNumber);
      console.log(thisCart.subtotalPrice);
      console.log(thisCart.totalPrice); */

      for (let key of thisCart.renderTotalKeys) {

        for (let elem of thisCart.dom[key]) {

          elem.innerHTML = thisCart[key];
        }
      }
    }
  }
  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;
      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.menuProduct = menuProduct;
      /* thisCartProduct.deliveryFee = settings.cart.defaultDeliveryFee; */
      thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();

      /* console.log('new CartProduct', thisCartProduct);
      console.log('productData', menuProduct);
 */
    }

    getElements(element) {
      const thisCartProduct = this;

      thisCartProduct.dom = {};
      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

    }
    initAmountWidget() {
      const thisCartProduct = this;
      thisCartProduct.amountWidget = new AmoungWidget(thisCartProduct.dom.amountWidget);

      thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
        thisCartProduct.amount = thisCartProduct.amountWidget.value;

        thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;

      });
    }
    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
      thisCartProduct.dom.wrapper.remove();
      /* console.log('jestem wywołana'); */
    }
    initActions() {
      const thisCartProduct = this;
      thisCartProduct.dom.edit.addEventListener('click', function (e) {
        e.preventDefault();

      });
      thisCartProduct.dom.remove.addEventListener('click', function (e) {
        e.preventDefault();

        thisCartProduct.remove();
      });
    }

  }
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

    },
    init: function () {
      const thisApp = this;
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
}
