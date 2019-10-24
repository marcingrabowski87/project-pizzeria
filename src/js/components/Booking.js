import {
  select,
  templates
} from '../settings.js';
import {
  utils
} from '../utils.js';

import {
  AmoungWidget
} from './AmoungWidget.js';

import {
  DatePicker
} from './DatePicker.js';
import {
  HourPicker
} from './HourPicker.js';



export class Booking {
  constructor(element) {
    /* console.log(element); */
    const thisBooking = this;
    thisBooking.element = element;
    thisBooking.render(thisBooking.element);
    thisBooking.initWidgets();

  }

  render(element) {

    const thisBooking = this;
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;

    const elementHtml = templates.bookingWidget(thisBooking.dom.wrapper);
    const visualHtml = utils.createDOMFromHTML(elementHtml);
    element.appendChild(visualHtml);

    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);
  }
  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmoungWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmoungWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}
