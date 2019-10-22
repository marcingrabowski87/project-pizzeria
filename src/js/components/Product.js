import {
  select,
  classNames,
  templates
} from '../settings.js';
import {
  utils
} from '../utils.js';
import {
  AmoungWidget
} from './AmoungWidget.js';


export class Product {
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
    /* app.cart.add(thisProduct); */
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }


}
