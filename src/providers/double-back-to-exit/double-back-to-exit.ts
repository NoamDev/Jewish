import {Injectable} from '@angular/core';
import {App, Platform, ToastController} from "ionic-angular";
import {filter} from "rxjs/operators";

const TIMEOUT = 3000;

@Injectable()
export class DoubleBackToExitProvider {
  private _stopFn: Function;

  constructor(
    private platform: Platform,
    private app: App,
    private toastCtrl: ToastController
  ) {}

  public startService() {
    if (this._stopFn) return;

    let timesPressed = 0;

    console.log('Double Back Service: STARTED');
    this._stopFn = this.platform.registerBackButtonAction(() => {
      if (timesPressed === 0) {
        ++timesPressed;
        setTimeout(() => {timesPressed = 0;}, TIMEOUT);

        this.toastCtrl
          .create({
            dismissOnPageChange: true,
            duration: TIMEOUT,
            message: 'לחץ שנית כדי לצאת',
            showCloseButton: false,
            position: 'bottom'
          })
          .present();

      } else {
        this.platform.exitApp();
      }
    });
  }

  public stopService() {
    if (this._stopFn) {
      this._stopFn();
      this._stopFn = null;
      console.log('Double Back Service: STOPPED');
    }
  }

  public forPage(page: Function) {
    this.app.viewWillEnter
      .pipe(filter((view) => view && view.component === page))
      .subscribe(() => {
        this.startService();
      });

    this.app.viewWillLeave
      .pipe(filter((view) => view && view.component === page))
      .subscribe(() => {
        this.stopService();
      });
  }
}
