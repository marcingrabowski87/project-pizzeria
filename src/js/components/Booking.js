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
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    console.log(thisBooking.dom);

    const elementHtml = templates.bookingWidget(thisBooking.dom.wrapper);
    const visualHtml = utils.createDOMFromHTML(elementHtml);
    element.appendChild(visualHtml);
  }
  initWidgets() {
    const thisBooking = this;

    /* thisBooking.peopleAmount = new AmoungWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmoungWidget(thisBooking.dom.hoursAmount); */
  }
}
