export class BaseWidget {
  constructor(wrapperElement, initialValue) {

    const thisWidget = this;
    thisWidget.wrapperElement = wrapperElement;
    thisWidget.initialValue = initialValue;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
  }
}
