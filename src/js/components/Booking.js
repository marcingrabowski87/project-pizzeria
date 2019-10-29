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
import {
  settings
} from '../settings.js';



export class Booking {
  constructor(element) {
    /* console.log(element); */
    const thisBooking = this;
    thisBooking.element = element;
    thisBooking.render(thisBooking.element);
    thisBooking.initWidgets();
    thisBooking.getData();

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


  getData() {
    const thisBooking = this;
    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);
    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];
    // eslint-disable-next-line no-unused-vars
    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };

    /* const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    }; */

    /* Promise.all([
        fetch(urls.booking),
        fetch(urls.eventsCurrent),
        fetch(urls.eventsRepeat),
      ]).then(function ([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseDate(bookings, eventsCurrent, eventsRepeat);
      }); */
  }
  parseDate() {
    const thisBooking = this;
    thisBooking.booked = {};
  }
}
