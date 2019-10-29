import {
  settings,
  select
} from '../settings.js';
import {
  BaseWidget
} from './BaseWidget.js';
import {
  utils
} from '../utils.js';

export class HourPicker extends BaseWidget {

  constructor(wrapper) {

    super(wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
  }
  initPlugin() {
    const thisWidget = this;
    // eslint-disable-next-line no-undef
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function () {
      thisWidget.value = thisWidget.dom.input.value;
    });
  }


  renderValue() {
    const thisWidget = this;

    thisWidget.dom.output.innerHTML = thisWidget.dom.choosedHour;
  }

  parseValue(newValue) {
    const thisWidget = this;
    thisWidget.dom.choosedHour = utils.numberToHour(newValue);

  }
  isValid() {
    return true;
  }
}
