import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[TextCapitalize]',
  standalone: true
})
export class TextCapitalizeDirective {

  @HostListener('input') onInputText() {
    this._transformText();
  }

  constructor(
    private _el: ElementRef
  ) {}

  private _transformText(): void {    
    if (this._el.nativeElement.value !== undefined && this._el.nativeElement.value !== null && this._el.nativeElement.value.length > 0) {
      this._el.nativeElement.value = this._el.nativeElement.value.at(0).toUpperCase() + this._el.nativeElement.value.slice(1);
    }
  }

}
