import {
  AfterContentInit, ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import {GoogleMapProvider} from "../../providers/google-map/google-map-provider";
import {MapObject} from "../../common/models/map-objects/map-objects";
import Autocomplete = google.maps.places.Autocomplete;
import PlaceResult = google.maps.places.PlaceResult;

@Directive({
  selector: '[fkPlaceAutoComplete]'
})
export class PlaceAutoComplete implements AfterContentInit, OnDestroy {
  private _inputElement: HTMLInputElement;
  public mapObject: MapObject;
  private autoComplete: Autocomplete;
  private marker: google.maps.Marker;

  @Input() set inputElement(v) {
    if (v == null)
      return;
    this.validateElementIsHTMLInputElement(v);
    this._inputElement = v;
    this.initAutoComplete().then(() => {
      this.registerToInputElementEvents();
      if (this.mapObject != null)
        v.value = this.mapObject.userFriendlyAddress;
    });
  }

  get inputElement() {
    return this._inputElement;
  }

  @Input() useNativeInput: boolean = false;

  @Input() map;

  @Input() toMarkerSelectedPlace: boolean = false;

  @Output() placeSelected: EventEmitter<MapObject>;

  constructor(private googleMapProvider: GoogleMapProvider,
              private el: ElementRef) {
    console.log('Hello PlaceAutocompleteComponent directive');
    this.placeSelected = new EventEmitter<MapObject>();
    this.mapObject = new MapObject();
  }

  async ngAfterContentInit() {
    try {
      if (this.useNativeInput)
        this.inputElement = this.el.nativeElement;
    }
    catch (e) {
      console.error(e);
    }
  }

  ngOnDestroy(): void {
    this.inputElement.removeEventListener("focus", this.onInputFocus.bind(this));
    this.inputElement.removeEventListener("blur", this.onInputBlur.bind(this));
  }

  private validateElementIsHTMLInputElement(el) {
    if (!(el instanceof HTMLInputElement))
      throw new Error("Input element must be type of HTMLInputElement");
  }

  private registerToInputElementEvents() {
    this.inputElement.addEventListener("focus", this.onInputFocus.bind(this));
    this.inputElement.addEventListener("blur", this.onInputBlur.bind(this));
  }

  async initAutoComplete() {
    await this.googleMapProvider.loadAPI();
    let htmlInput = this.inputElement;
    htmlInput.style.width = "100%";
    this.autoComplete = new google.maps.places.Autocomplete(htmlInput);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    if (this.map)
      this.autoComplete.bindTo('bounds', this.map);

    // Set the data fields to return when the user selects a place.
    this.autoComplete.setValues(['address_components', 'geometry', 'icon', 'name']);
    this.autoComplete.addListener('place_changed', () => {
      let place = this.autoComplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        this.updateSelectedMapObject(null);
        return;
      }

      this.updateSelectedMapObject(place);
      this.emitEvents();
      this.handleMapMarkerAndNavigation(place);
    });
  }

  private updateSelectedMapObject(place: PlaceResult) {
    if (place == null)
      this.mapObject = new MapObject();
    else {
      this.mapObject = new MapObject({
        userFriendlyAddress: this.inputElement.value,
        latLng: place.geometry.location.toJSON()
      });
    }
  }

  private emitEvents() {
    this.placeSelected.emit(this.mapObject);
  }

  private handleMapMarkerAndNavigation(place: PlaceResult) {
    if (!this.map)
      return;

    if (this.marker)
      this.marker.setMap(null);

    if (!place)
      return;

    if (this.toMarkerSelectedPlace)
      this.marker = this.map.createMarkerAt({position: place.geometry.location.toJSON()});

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      this.map.fitBounds(place.geometry.viewport);
    } else {
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(17);  // Why 17? Because it looks good.
    }
  }

  /**
   * Used for set the input value to the `userFriendlyAddress` because it always is being reset.
   */
  private onInputFocus() {
    this.inputElement.value = this.mapObject.userFriendlyAddress || this.inputElement.value;
  }

  /**
   * Used for set the input value to the `userFriendlyAddress` because it always is being reset.
   */
  private onInputBlur() {
    if (this.mapObject.userFriendlyAddress && this.mapObject.userFriendlyAddress != this.inputElement.value) {
      this.updateSelectedMapObject(null);
      this.emitEvents();
      this.handleMapMarkerAndNavigation(null);
    }
  }
}
