import {
  select,
  settings
} from '../settings.js';

export class AmoungWidget {

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

    let condition = newValue !== parseInt(thisWidget.value) && newValue >= settings.amountWidget.defaultMin;
    if (condition && newValue <= settings.amountWidget.defaultMax) {
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
