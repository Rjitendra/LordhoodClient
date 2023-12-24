import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numbersOnly]',
})
export class NumbersOnlyDirective {
  private _value = '';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this._value || '';
    const input = event.target as HTMLInputElement;
    const newValue = input.value.replace(/[^0-9]*/g, '');
    if (newValue !== this._value) {
      this._value = newValue;
      input.value = this._value;
      input.dispatchEvent(new Event('input'));
      event.stopPropagation();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: any) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('text/plain');
    if (!pastedData.match(/^\d+$/)) {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    const keys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];
    if (keys.indexOf(event.key) !== -1) {
      return; // let the event bubble up
    }
    if (event.key && isNaN(parseInt(event.key, 10))) {
      event.preventDefault();
    }
  }

  @HostListener('blur', ['$event']) onBlur(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = this._value;
  }
}
