import { Component, Input } from '@angular/core';
import { GoogleMap } from "../../providers/google-map/google-map";
import { LocationTrackingProvider } from "../../providers/location-tracking/location-tracking";
import { ToastController } from "ionic-angular";
import { Config } from '@app/env';
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'fk-locate-button',
  templateUrl: 'locate-button.html'
})
export class LocateButtonComponent {

  @Input()
  map: GoogleMap;

  constructor(private locationTracking: LocationTrackingProvider,
    private toastCtrl: ToastController,
    public lngService: LanguageServiceProvider,
  ) {
    console.log('Hello LocateButtonComponent Component');
  }

  async onButtonClicked() {
    try {
      let position = await this.locationTracking.getCurrentLocation({ timeout: Config.locateMeTimeoutInMs });
      this.map.map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    }
    catch (e) {
      const toast = this.toastCtrl.create({ message: this.lngService.getOneLanguage('unable_to_find_location'), duration: 3000 });
      toast.willEnter.take(1).subscribe(value => {
        toast.instance._elementRef.nativeElement.setAttribute('text-center', "");
      });
      toast.present();
    }
  }
}
