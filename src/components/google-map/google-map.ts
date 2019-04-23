import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, Output } from '@angular/core';
import { GoogleMapProvider } from "../../providers/google-map/google-map-provider";
import { GoogleMap } from "../../providers/google-map/google-map";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { MapObject } from "../../common/models/map-objects/map-objects";

import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LanguageServiceProvider } from '../../providers/language-service/language-service';
import { Platform } from 'ionic-angular';
import MapOptions = google.maps.MapOptions;


@Component({
  selector: 'fk-google-map',
  templateUrl: 'google-map.html',
})
export class GoogleMapComponent implements AfterViewInit, OnDestroy {

  private static mapCounter = 0;

  public hasError = false;

  public isMapReady = false;
  public readonly canvasElementId: string;
  public map: GoogleMap;

  public mapSwitch = false;

  @Input() mapOptions: google.maps.MapOptions;

  @Output()
  onMapCreated: ReplaySubject<GoogleMap>;
  manualCenter: MapObject;

  constructor(private mapProvider: GoogleMapProvider,
    private cdRef: ChangeDetectorRef,
    private locationAccuracy: LocationAccuracy,
    private openNativeSettings: OpenNativeSettings,
    public lngService: LanguageServiceProvider,
    public plt: Platform,
    // public translate: TranslateService,
  ) {
    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');

    console.log('Hello GoogleMapComponent Component');
    GoogleMapComponent.mapCounter++;
    this.canvasElementId = `google-map-${ GoogleMapComponent.mapCounter }`;
    this.onMapCreated = new ReplaySubject<GoogleMap>(1);
    this.manualCenter = new MapObject();
    console.log(this.map);
  }

  async ngAfterViewInit() {
    console.log("ngAfterViewInit");
    if (!this.plt.is('mobileweb')) {
      this.convertGPS();
    } else {
      this.createMap(true);
      this.mapSwitchDetect(true);
    }
    // let isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
    // console.log(isApp);
    // if (isApp) {
    //   console.log('mobile');
    //   this.convertGPS();
    // } else {
    //   console.log('browser');
    //   this.createMap(true);
    //   this.mapSwitchDetect(true);
    // }
  }

  convertGPS() {
    console.log("this.locationAccuracy");
    if (this.locationAccuracy == null) {
      setTimeout(() => {
        this.convertGPS();
      }, 500);
    } else {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        console.log("canRequest");
        if (canRequest) {
          console.log("Location permission is working");
          console.log('Request successful');
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (result) => {
              console.log(result);
              console.log('Request successful');
              this.createMap(true);
              this.mapSwitchDetect(true);
            },
            error => {
              // this.convertGPS();
              this.mapSwitchDetect(false);
              this.hasError = true;
              console.log('Error requesting location permissions', error);
            }
          );
        } else {
          console.log("Can't access location devices");
          console.log(canRequest);
          this.mapSwitchDetect(false);
          this.hasError = true;
          if (localStorage.getItem("setManual") === "set") {

          } else {
            setTimeout(() => {
              this.convertGPS();
            }, 500);
          }
        }

      });
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (!this.map)
      return;
    this.map.disableLocationTracking();
    this.map.dispose();
    this.map = null;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  async createMap(withLocationTracking: boolean, mapOptions: MapOptions = this.mapOptions) {
    try {
      let mapElement = document.getElementById(this.canvasElementId) as HTMLDivElement;
      console.log(this.canvasElementId);
      this.map = await this.mapProvider.createMap(mapElement, mapOptions);
      if (withLocationTracking) {
        this.map.enableLocationTracking();
      }
      this.isMapReady = true;
      this.onMapCreated.next(this.map);
      this.mapSwitchDetect(true);
    }
    catch (e) {
      console.error(e);
      this.hasError = true;
    }
  }

  tryGetCurrentLocationAgain() {
    this.hasError = false;
    this.convertGPS();
  }

  goToLocationSettings() {
    this.openNativeSettings.open('location');
  }

  mapWithManualLocation() {
    this.createMap(false, { center: this.manualCenter.latLng });
    localStorage.setItem("setManual", "set");
    this.mapSwitchDetect(true);
  }

  onPlaceSelected(mapObject: MapObject) {
    this.manualCenter = mapObject;
    this.cdRef.detectChanges();
  }

  mapSwitchDetect(state) {
    this.mapSwitch = state;

    console.log(this.mapSwitch);
  }
}
