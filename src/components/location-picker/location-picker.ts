import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { TextInput, ViewController } from "ionic-angular";
import { GoogleMapProvider } from "../../providers/google-map/google-map-provider";
import { GoogleMapComponent } from "../google-map/google-map";
import Map = google.maps.Map;
import Marker = google.maps.Marker;
import { MapObject } from "../../common/models/map-objects/map-objects";
import LatLngLiteral = google.maps.LatLngLiteral;
import { StaticValidators } from "../../validators/static-validators";
import { PlaceAutoComplete } from "../../directives/place-autocomplete/place-autocomplete";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'fk-location-picker',
  templateUrl: 'location-picker.html',
})
export class LocationPickerComponent implements OnDestroy, AfterViewInit {
  @ViewChild('mapComponent') mapComponent: GoogleMapComponent;
  @ViewChild('PlaceAutoCompleteInput') placeAutoCompleteInput: TextInput;
  @ViewChild(PlaceAutoComplete) placeAutoComplete: PlaceAutoComplete;

  marker: Marker;
  mapObject: MapObject;

  constructor(private viewCtrl: ViewController,
    private mapProvider: GoogleMapProvider,
    public lngService: LanguageServiceProvider,
  ) {
    console.log('Hello LocationPickerComponent Component');
    this.mapObject = new MapObject();

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');
  }

  ngAfterViewInit() {
    this.mapComponent.onMapCreated.subscribe(args => {
      this.initOnLocationPressed(this.mapComponent.map.map);
    }, err => { console.error('Could not load Location-Picker because it could not create a Map') });
  }

  onAutoCompleteSelect(mapObject: MapObject) {
    if (mapObject) {
      this.changeMarkerPosition(mapObject.latLng);
      this.mapObject = mapObject;
    }
  }

  public onDismiss() {
    this.viewCtrl.dismiss(null);
  }

  public onSubmit() {
    if (StaticValidators.IsLocationValid(this.mapObject, false))
      this.viewCtrl.dismiss(this.mapObject);
    else
      this.viewCtrl.dismiss(null);
  }

  private initOnLocationPressed(map: Map) {
    map.addListener('click', async args => {
      this.changeMarkerPosition(args.latLng);

      const latLng = this.marker.getPosition().toJSON();
      const userFriendlyAddress = (await this.mapProvider.getPlaceDetails(latLng)).formatted_address;

      this.mapObject.userFriendlyAddress = userFriendlyAddress;
      this.mapObject.latLng = latLng;
      this.placeAutoCompleteInput._native.nativeElement.value = userFriendlyAddress;
      this.placeAutoComplete.mapObject = this.mapObject;

      this.disappearAutoCompleteList();
    });
  }

  private changeMarkerPosition(newPosition: LatLngLiteral) {
    if (this.marker)
      this.marker.setPosition(newPosition);
    else
      this.marker = this.mapComponent.map.createMarkerAt({ position: newPosition });
  }

  private disappearAutoCompleteList() {
    Array.from(document.getElementsByClassName('pac-container'))
      .forEach(el => (el as HTMLElement).style.display = "none");
  }

  ngOnDestroy() {
    Object.keys(this).forEach(k => delete this[k]);
  }
}
