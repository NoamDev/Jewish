import {Component} from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ScreenOrientation} from '@ionic-native/screen-orientation';

import {HomePage} from '../pages/home/home';
import {TranslateService} from '@ngx-translate/core';
import {DoubleBackToExitProvider} from "../providers/double-back-to-exit/double-back-to-exit";

@Component({
  templateUrl: 'app.component.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private screenOrientation: ScreenOrientation,
    public translate: TranslateService,
    public events: Events,
    dblBack: DoubleBackToExitProvider
  ) {
    dblBack.forPage(HomePage);

    platform.ready().then(() => {

      events.subscribe('user:created', (user, time) => {

        this.ionInit();

      });

      this.ionInit();

      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
        this.screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
      }
    });
  }

  ionInit() {
    this.translate.addLangs(['en', 'he']);
    this.translate.setDefaultLang(localStorage.getItem('set_lng') != null ? localStorage.getItem('set_lng') : "en");
    this.translate.use(localStorage.getItem('set_lng') != null ? localStorage.getItem('set_lng') : "en");
  }
}

