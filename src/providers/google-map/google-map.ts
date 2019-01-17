import {merge} from "lodash-es";
import {Subscription} from "rxjs/Subscription";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/take";
import {EventBasedMapObject} from "../../common/models/map-objects/map-objects";
import {InfoWindow} from "./info-window";
import {LocationTrackingProvider} from "../location-tracking/location-tracking";
import LatLngLiteral = google.maps.LatLngLiteral;
import {Config} from "@app/env";
import {ToastController} from "ionic-angular";
import MarkerOptions = google.maps.MarkerOptions;

export class GoogleMap {
  private markers: google.maps.Marker[];
  private circles: google.maps.Circle[];
  private infoWindows: InfoWindow[];
  private locationMarker: google.maps.Marker;
  private locationCircle: google.maps.Circle;
  private locationTrackingSubscription: Subscription;
  private prevLocation: LatLngLiteral;

  constructor(public map: google.maps.Map,
              private toastCtrl: ToastController,
              private locationTracking: LocationTrackingProvider) {
    this.markers = [];
    this.circles = [];
    this.infoWindows = [];
  }

  dispose() {
    this.disableLocationTracking();
    google.maps.event.clearInstanceListeners(this);
    this.markers.forEach(m => m.setMap(null));
    this.circles.forEach(c => c.setMap(null));
    this.infoWindows.forEach(iw => iw.dispose());
  }

  enableLocationTracking() {
    this.initMarker();
    // this.initCircle();
    this.startWatchingUserPosition();
  }

  disableLocationTracking() {
    if (this.locationTrackingSubscription == null || this.locationTrackingSubscription.closed)
      return;
    this.locationTrackingSubscription.unsubscribe();
    this.locationMarker.setMap(null);
    // this.locationCircle.setMap(null);
  }

  private startWatchingUserPosition() {
    if (this.locationTrackingSubscription != null && !this.locationTrackingSubscription.closed)
      return;
    this.locationTrackingSubscription = this.locationTracking.onLocationChanged.subscribe(geoposition => {
      const latLng = this.locationTracking.geopositionToLatLngLiteral(geoposition);
      if (!this.prevLocation){
        this.prevLocation = latLng;
      } else{
        if (Math.abs(this.prevLocation.lat - latLng.lat) < 0.00001 ||
            Math.abs(this.prevLocation.lat - latLng.lat) < 0.000001)
          return;

        this.prevLocation = latLng;
        this.changeCircleAndMarkerCenter(latLng);
      }
      // To set map center to be as the user location uncomment the line below
      // this.map.setCenter(latLng);
    });
  }

  createMarkerAt(options: google.maps.MarkerOptions) {
    options = merge({map: this.map}, options);
    let marker = new google.maps.Marker(options);
    this.markers.push(marker);
    return marker;
  }

  async drawEventBasedMapObject(mapObject: EventBasedMapObject): Promise<{marker: google.maps.Marker, infoWindow: InfoWindow}> {
    let iconUrl = `${Config.iconsBasePath}/${mapObject.type}.svg`;
    let markerParams: MarkerOptions = {
      map: this.map,
      position: mapObject.latLng,
      zIndex: 1,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(64, 64)
      } as google.maps.Icon
    };
    let marker = this.createMarkerAt(markerParams);
    let infoWindow = new InfoWindow(mapObject, marker)
    this.infoWindows.push(infoWindow);
    return {marker, infoWindow};
  }

  private initCircle() {
    this.locationCircle = new google.maps.Circle({
      zIndex: 2,
      clickable: false,
      strokeColor: "#3a84df",
      strokeOpacity: .8,
      strokeWeight: .5,
      fillColor: "#3a84df",
      fillOpacity: .25,
      map: this.map,
      center: this.map.getCenter(),
      radius: 10,
      visible: true
    });
  }

  private initMarker() {
    this.locationMarker = new google.maps.Marker({
      clickable: false,
      optimized: false,
      position: this.map.getCenter(),
      map: this.map,
      zIndex: 2,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: "#3a84df",
        fillOpacity: .9,
        strokeColor: "#fff",
        strokeWeight: 4
      },
      visible: true
    });
  }

  private changeCircleAndMarkerCenter(latLng: LatLngLiteral) {
    this.locationMarker.setPosition(latLng);
    // this.locationCircle.setCenter(latLng);
  }
}
