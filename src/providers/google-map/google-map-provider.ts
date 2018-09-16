import {Injectable} from '@angular/core';
import {Geolocation} from "@ionic-native/geolocation";
import {AppAssetsProvider} from "../app-assets/app-assets";
import {ApplicationMapObject} from "../../common/models/map-objects/map-objects";
import GoogleMapsLoader = require("google-maps");
import MapOptions = google.maps.MapOptions;
import LatLngLiteral = google.maps.LatLngLiteral;
import GeocoderResult = google.maps.GeocoderResult;
import "rxjs/add/operator/filter";
import {GoogleMap} from "./google-map";
import {fromPromise} from "rxjs/observable/fromPromise";
import "rxjs/add/operator/retry";

@Injectable()
export class GoogleMapProvider {
  public isApiLoaded: boolean;

  constructor(public readonly geolocation: Geolocation,
              private appAssets: AppAssetsProvider) {
    console.log('Hello GoogleMapProvider Provider');
  }

  loadAPI(): Promise<void> {
    if (this.isApiLoaded)
      return;
    GoogleMapsLoader.KEY = "AIzaSyBCptJVdxT9qytWXFkm4cVfXa6qdDWOncI";
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
    if (!this.isApiLoaded) {
      await this.loadAPI();
      this.isApiLoaded = true;
    }

    const currentLocation = await fromPromise(this.geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: true})).retry(5).toPromise();;
    mapOptions = mapOptions || this.defaultMapOptions;
    mapOptions.center = {
      lat: currentLocation.coords.latitude,
      lng: currentLocation.coords.longitude
    };
    let map = new GoogleMap(new google.maps.Map(mapDivElement,
                      mapOptions || this.defaultMapOptions),
                           this.geolocation, this.appAssets);
    map.lastKnownPosition = currentLocation;
    return map;
  }

  getPlaceDetails(location: LatLngLiteral): Promise<GeocoderResult> {
    let geocoder = new google.maps.Geocoder();
    return new Promise<GeocoderResult>((resolve, reject) => {
      geocoder.geocode({location: location}, (results, status1) => {
        if (results && results.length > 0) {
          resolve(results[0]);
        } else {
          reject('Cannot determine address at this location');
        }
      });
    });
  }
}
