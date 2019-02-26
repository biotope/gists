// eslint-disable-next-line @typescript-eslint/no-triple-slash-reference,spaced-comment
/// <reference types="jquery" />

/*
 * This is a component that you can extend from to avoid copy-pasting the jquery way of making it
 * available on handlebars.
 */

type DataType = string | number | boolean | object;

let isNumeric: (value: DataType) => boolean;

export abstract class Component {
  protected static globalName: string;

  protected element: HTMLElement;

  public constructor(element: HTMLElement) {
    this.element = element;
  }

  public static register(jquery: JQueryStatic): void {
    const childClass = this;
    isNumeric = isNumeric || jquery.isNumeric;

    if (!childClass.globalName) {
      throw new Error('You did not set the "globalName" variable on your component.');
    }

    // eslint-disable-next-line no-param-reassign,func-names,@typescript-eslint/no-explicit-any
    jquery.fn[childClass.globalName] = function (...args: any[]) {
      const element = this as JQuery;

      if (!element.data(childClass.globalName) && element.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element.data(childClass.globalName, new (childClass as any)(element[0], ...args));
      }
    };
  }

  protected getDataAttr(atributeName: string): DataType {
    const attribute: Attr | null = this.element.attributes.getNamedItem(`data-${atributeName}`);
    let parsedValue: DataType = attribute ? attribute.value : undefined;

    if (isNumeric(parsedValue)) {
      parsedValue = +(parsedValue);
    } else {
      try {
        parsedValue = JSON.parse(parsedValue);
      // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    return parsedValue;
  }
}
