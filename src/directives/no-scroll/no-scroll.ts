import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[no-scroll]'
})
export class NoScrollDirective {

  constructor(private elemRef: ElementRef) {
  }

  ngAfterContentInit() {
    const scrollEl = (this.elemRef.nativeElement as HTMLElement).getElementsByClassName('scroll-content').item(0) as HTMLElement;
    scrollEl.style.overflowY = "hidden";
  }
}
