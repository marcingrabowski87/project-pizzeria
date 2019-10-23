import {
  BaseWidget
} from './BaseWidget.js';
import {
  utils
} from '../utils.js';
import {
  select,
  settings
} from '../settings.js';
export class DatePicker extends BaseWidget {
  constructor(wrapper) {

    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;
    thisWidget.dom.wrapper = wrapper;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();

  }



  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    const amountFutureDay = settings.datePicker.maxDaysInFuture;
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, amountFutureDay);



    const options = {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      disable: [
        function (date) {
          // return true to disable
          return (date.getDay() === 1);
        }
      ],

      locale: {
        firstDayOfWeek: 1
      },
      onChange: function (dateStr) {
        console.log(dateStr);
        thisWidget.value = dateStr;
        thisWidget.renderValue();
      }

    };

    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, options);

  }



  renderValue() {
    const thisWidget = this;
    console.log('widget value:', thisWidget.value);
  }
}
