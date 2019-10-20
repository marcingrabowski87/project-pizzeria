import {
  select,
  classNames,
  settings,
  templates
} from '../settings.js';
import {
  utils
} from '../utils.js';
import {
  CartProduct
} from './CartProduct.js';


export class Cart {
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
