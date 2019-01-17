import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the LanguageServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LanguageServiceProvider {

  public currentLng: any;
  public direction: any;

  constructor(public translate: TranslateService) {

  }

  setLanguage() {
    // this.translate.addLangs(['en', 'he']);
    if (typeof (localStorage.getItem("set_lng")) == "undefined" || localStorage.getItem("set_lng") == "" || localStorage.getItem("set_lng") == null) {
      this.translate.use('en');

      localStorage.setItem('currentLng', 'en');
      localStorage.setItem('direction', 'unset');
      localStorage.setItem('set_lng', 'en');
      localStorage.setItem('set_location', 'GB');
      this.currentLng = 'en';
      this.direction = 'unset';
    } else {
      this.translate.use(localStorage.getItem("set_lng"));
      this.currentLng = localStorage.getItem("set_lng");
      localStorage.setItem('currentLng', localStorage.getItem("set_lng"));
      if (this.currentLng == "he") {
        localStorage.setItem('direction', 'rtl');
      } else {
        localStorage.setItem('direction', 'ltr');
      }
    }
  }

  switchLanguage(lng) {
    localStorage.setItem('set_lng', lng);
    if (lng == 'he') {
      localStorage.setItem('set_location', 'IL');
    } else {
      localStorage.setItem('set_location', 'GB');
    }
  }

  setArrayLanguage(arraySam) {

    let changeArray = new Array();

    for (let list of arraySam) {
      this.translate.get(list).subscribe(
        value => {
          changeArray.push(value);
        }
      );
    }

    return changeArray;

  }

  getOneLanguage(word) {

    this.translate.get(word).subscribe(
      value => {
        word = value;
      });

    return word;

  }

}
