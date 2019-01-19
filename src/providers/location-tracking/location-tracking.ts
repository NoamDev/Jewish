import {EventEmitter, Injectable} from '@angular/core';
import {Subscription} from "rxjs/Subscription";
import {Geolocation, GeolocationOptions, Geoposition} from "@ionic-native/geolocation";
import "rxjs/add/operator/finally";
import {Config} from "@app/env";
import LatLngLiteral = google.maps.LatLngLiteral;


@Injectable()
export class LocationTrackingProvider {

  public currentLocationPromise: Promise<Geoposition>;
  private watchSubscription: Subscription;

  public onLocationChanged: EventEmitter<Geoposition>;
  public lastKnownPosition: Geoposition;

  public get lastKnownLatLng(): LatLngLiteral {
    return this.geopositionToLatLngLiteral(this.lastKnownPosition)
  };

  constructor(private readonly geolocation: Geolocation) {
    this.onLocationChanged = new EventEmitter<Geoposition>();
    this.startWatchLocation();
  }

  async getCurrentLocation(options?: GeolocationOptions) {
    this.stopWatchLocation();
    this.currentLocationPromise = this.currentLocationPromise || this.geolocation.getCurrentPosition(options);
    try{
      this.lastKnownPosition = await this.currentLocationPromise;
    }
    finally {
      this.currentLocationPromise = null;
      this.startWatchLocation();
    }
    return this.lastKnownPosition;
  }

  public geopositionToLatLngLiteral(geoposition: Geoposition) {
    if (!geoposition)
      return null;
    return {
      lat: geoposition.coords.latitude,
      lng: geoposition.coords.longitude
    }
  }

  private startWatchLocation() {
    this.watchSubscription =
      this.geolocation.watchPosition({timeout: Config.watchLocationIntervalInMs})
        .filter((p) => p.coords !== undefined)
        .subscribe((pos) => {
          this.lastKnownPosition = pos;
          this.onLocationChanged.next(pos);
        }, (err) => {
          console.error('Error while watching position: ' + err);
        });
  }

  private stopWatchLocation() {
    if (this.watchSubscription)
      this.watchSubscription.unsubscribe();
  }
}
