import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {MapObject} from "../../common/models/map-objects/map-objects";
import {LocationPickerComponent} from "../../components/location-picker/location-picker";
import {ModalController} from "ionic-angular";
import {AbstractValueAccessor, MakeProvider} from "../../common/component-helpers/abstract-value-accessor";

@Directive({
  selector: '[fkLocationPickerModal]'
})
export class LocationPickerModalDirective {

  @Output() public locationSelected: EventEmitter<MapObject>;

  constructor(private modalCtrl: ModalController) {
    console.log('Hello LocationPickerModalDirective Directive');
    this.locationSelected = new EventEmitter<MapObject>();
  }

  openMapLocationPicker(){
    const modal = this.modalCtrl.create(LocationPickerComponent);
    modal.onDidDismiss((data: MapObject) => {
      this.locationSelected.emit(data);
    });
    modal.present();
  }

  @HostListener('click') onClick(){
    this.openMapLocationPicker();
  }
}
