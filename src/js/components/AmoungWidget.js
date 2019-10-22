import {
  select,
  settings
} from '../settings.js';
import {
  BaseWidget
} from './BaseWidget.js';

export class AmoungWidget extends BaseWidget {

  constructor(wrapper) {
    super(wrapper, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements();

    thisWidget.initActions();

  }
  getElements() {
    const thisWidget = this;


    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrase = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
    thisWidget.dom.input.value = settings.amountWidget.defaultValue;

  }

  isValid(newValue) {
    let condition = newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
    return !isNaN(newValue) && condition;
  }
  renderValue() {
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }


  initActions() {


    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function (e) {
      e.preventDefault();



      thisWidget.value = thisWidget.dom.input.value;

    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (e) {

      e.preventDefault();
      thisWidget.value--;

    });

    thisWidget.dom.linkIncrase.addEventListener('click', function (e) {


      e.preventDefault();
      thisWidget.value++;

    });

  }

}
