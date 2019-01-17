import { Injectable } from '@angular/core';
import GoogleMapsLoader = require("google-maps");
import MapOptions = google.maps.MapOptions;
import GeocoderResult = google.maps.GeocoderResult;
import "rxjs/add/operator/filter";
import { GoogleMap } from "./google-map";
import "rxjs/add/operator/retry";
import { LocationTrackingProvider } from "../location-tracking/location-tracking";
import { merge } from "lodash-es";
import { ToastController } from "ionic-angular";
import LatLngLiteral = google.maps.LatLngLiteral;

@Injectable()
export class GoogleMapProvider {
  public isApiLoaded: boolean;

  constructor(private locationTracking: LocationTrackingProvider, private toastCtrl: ToastController) {
    console.log('Hello GoogleMapProvider Provider');
  }

  loadAPI(): Promise<void> {
    if (this.isApiLoaded)
      return;
    GoogleMapsLoader.KEY = "AIzaSyBCptJVdxT9qytWXFkm4cVfXa6qdDWOncI";
    if (typeof (localStorage.getItem("set_lng")) == "undefined" || localStorage.getItem("set_lng") == "" || localStorage.getItem("set_lng") == null) {
      GoogleMapsLoader.LANGUAGE = 'en';
      GoogleMapsLoader.REGION = 'GB';
    } else {

      GoogleMapsLoader.LANGUAGE = localStorage.getItem("set_lng");
      GoogleMapsLoader.REGION = localStorage.getItem('set_location');
    }
    GoogleMapsLoader.LANGUAGE = 'he';
    GoogleMapsLoader.REGION = 'IL';
    GoogleMapsLoader.VERSION = '3.34';
    GoogleMapsLoader.LIBRARIES = ['places'];
    return new Promise<void>(resolve => GoogleMapsLoader.load(() => {
      resolve();
    }));
  }

  get defaultMapOptions(): MapOptions {
    return {
      zoom: 18,
      tilt: 30,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  }

  async createMap(mapDivElement: HTMLDivElement, mapOptions?: MapOptions): Promise<GoogleMap> {
    await this.loadAPI();
    mapOptions = merge(mapOptions, this.defaultMapOptions);

    mapOptions.center = await this.getMapCenterOrCurrentLocation(mapOptions);

    const googleMap = new google.maps.Map(mapDivElement, mapOptions || this.defaultMapOptions);
    let mapManager = new GoogleMap(googleMap, this.toastCtrl, this.locationTracking);

    return mapManager;
  }

  getPlaceDetails(location: LatLngLiteral): Promise<GeocoderResult> {
    let geocoder = new google.maps.Geocoder();
    return new Promise<GeocoderResult>((resolve, reject) => {
      geocoder.geocode({ location: location }, (results, status1) => {
        if (results && results.length > 0) {
          resolve(results[0]);
        } else {
          reject('Cannot determine address at this location');
        }
      });
    });
  }

  getDistanceFromLatLonInKm(latLng1: LatLngLiteral, latLng2: LatLngLiteral) {
    const lat1 = latLng1.lat;
    const lon1 = latLng1.lng
    const lat2 = latLng2.lat;
    const lon2 = latLng2.lng;

    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  private async getMapCenterOrCurrentLocation(mapOptions?: MapOptions) {
    if (mapOptions.center) {
      return mapOptions.center;
    }

    const position = await this.locationTracking.getCurrentLocation({ timeout: 3000 });
    return this.locationTracking.geopositionToLatLngLiteral(position);
  }
}
