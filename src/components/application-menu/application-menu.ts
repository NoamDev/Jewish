import {Component, Input} from '@angular/core';
import {Nav, NavController} from "ionic-angular";

declare type PagesDictionary = {[componentName: string]: {title: string}}

@Component({
  selector: 'fk-application-menu',
  templateUrl: 'application-menu.html'
})
export class ApplicationMenuComponent {

  @Input()
  applicationContent: Nav;

  pages: PagesDictionary;

  constructor() {
    console.log('Hello ApplicationMenuComponent Component');
    this.pages = {};
    this.pages.MyPage = {title: "My cool page"};
  }

  getPagesTitle(){
    return Object.keys(this.pages).map(compName => this.pages[compName]);
  }

  changePage(page) {
    // do change page
    // this.navCtrl.
  }
}
