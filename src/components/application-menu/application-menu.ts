import {Component, Input} from '@angular/core';
import {Nav, ViewController} from "ionic-angular";
import {AddSynagoguePage} from "../../pages/add-synagogue/add-synagogue";

declare type MenuPageItem = { title: string, componentName: string, args?: any };
declare type PagesDictionary = { [componentName: string]: MenuPageItem}

@Component({
  selector: 'fk-application-menu',
  templateUrl: 'application-menu.html'
})
export class ApplicationMenuComponent {

  private _applicationContentNav: Nav;

  @Input() set applicationContentNav(v) {
    this._applicationContentNav = v;
    this.registerToNavEvents();
  }
  get applicationContentNav() {return this._applicationContentNav;}

  pages: PagesDictionary;
  currentPage: string;

  constructor() {
    console.log('Hello ApplicationMenuComponent Component');
    this.initPages();
  }

  initPages(){
    this.pages = {};
    this.pages.AddSynagoguePage = {title: "הוספת בית כנסת", componentName: "AddSynagoguePage"};
    this.pages.SynagogueDetails = {title: "פרטי בית כנסת", componentName: "SynagogueDetailsPage"};
  }

  registerToNavEvents(){
    this.applicationContentNav.viewWillEnter.subscribe((ev: ViewController) => {
      this.currentPage = ev.component.name;
    });
  }

  getPagesTitle() {
    return Object.keys(this.pages).map(compName => this.pages[compName]);
  }

  changePage(page: MenuPageItem) {
    // do change page
    this.applicationContentNav.push(page.componentName, page.args || {}, {
      animation: 'transition',
      animate: true,
      duration: 500,
      direction: 'forward'
    })
  }
}
