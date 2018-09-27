import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {Synagogue} from "../../common/models/map-objects/synagogue";
import {ImagePicker, ImagePickerOptions, OutputType} from "@ionic-native/image-picker";
import {EventBasedMapObjectProvider} from "../../providers/server-providers/event-based-map-object.provider";
import {Event} from "../../common/models/event/event";
import {DatePipe} from "@angular/common";
import {AddEventModalComponent} from "../../components/add-event-modal/add-event-modal";
import {EventTypes} from "../../common/models/common/enums/event-types";
import {StaticValidators} from "../../validators/static-validators";
import {MapObject} from "../../common/models/map-objects/map-objects";
import {PlaceAutoComplete} from "../../directives/place-autocomplete/place-autocomplete";

@IonicPage()
@Component({
  selector: 'page-add-synagogue',
  templateUrl: 'add-synagogue.html',
  providers: [DatePipe]
})
export class AddSynagoguePage {

  @ViewChild('placeAutoCompleteInput') placeAutoCompleteInput;
  @ViewChild(PlaceAutoComplete) placeAutoComplete: PlaceAutoComplete;
  @ViewChild('form') form: NgForm;

  phoneNumber: string;
  synagogue: Synagogue;
  eventsToShow: string;
  phonePattern = /^\d{2,3}-?\d{7}$/;
  eventsDictionary: {[type: string]: Event[]};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private imagePicker: ImagePicker,
              private mapObjectProvider: EventBasedMapObjectProvider,
              private modalCtrl: ModalController) {
    this.synagogue = this.navParams.get('synagogue') as Synagogue || new Synagogue();
    this.createEventsDictionary();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSynagoguePage');
  }

  ngAfterViewInit(){
    console.log(this.form);
  }

  async submitNewSynagogue(){
    await this.mapObjectProvider.create(this.synagogue);
  }

  async pickImage() {
    try {
      let imagePickerOptions = {maximumImagesCount: 1, outputType: OutputType.DATA_URL} as ImagePickerOptions;
      this.synagogue.picture = await this.imagePicker.getPictures(imagePickerOptions);
    }
    catch (e) {
      console.error(e);
    }
  }

  openAddTimesModal() {
    const modal = this.modalCtrl.create(AddEventModalComponent,null, {
      enableBackdropDismiss: true,
      showBackdrop: true,
    });
    modal.onDidDismiss((data: Event) => {
      if (data == null)
        return;
      this.synagogue.events.push(data);
    });
    modal.present();
  }

  addPhoneNumber(){
    if (this.synagogue.phone.findIndex(p => p == this.phoneNumber) == -1)
      this.synagogue.phone.push(this.phoneNumber);
  }

  removePhone() {
    let index = this.synagogue.phone.findIndex(p => p == this.phoneNumber);
    this.synagogue.phone.splice(index, 1);
  }

  onModalClosed(mapObject: MapObject){
    if (mapObject && mapObject.userFriendlyAddress) {
      this.onMapObjectChanged(mapObject);
      this.placeAutoComplete.mapObject = mapObject;
      this.placeAutoCompleteInput._native.nativeElement.value = this.synagogue.userFriendlyAddress;
    }
  }

  onMapObjectChanged(mapObject: MapObject){
    if (!mapObject || !mapObject.userFriendlyAddress)
      return;
    this.synagogue.latLng = mapObject.latLng && mapObject.latLng;
    this.synagogue.userFriendlyAddress = mapObject.userFriendlyAddress && mapObject.userFriendlyAddress;
  }

  isFormValid(){
    const mapObject = {latLng: this.synagogue.latLng, userFriendlyAddress: this.synagogue.userFriendlyAddress} as MapObject
    let isMapObjectValid = StaticValidators.IsLocationValid(mapObject, true);
    return isMapObjectValid && this.form.valid;
  }

  formatTimeRange(event: Event){
    return event.formatTimeRange();
  }

  removeEvent(event: Event) {
    let index = this.eventsDictionary[event.type].findIndex(ev => ev == ev);
    this.eventsDictionary[event.type].splice(index, 1);
    this.synagogue.events.splice(this.synagogue.events.findIndex(ev => ev == event), 1);
  }

  createEventsDictionary(){
    this.eventsDictionary = {};
    Object.keys(EventTypes).map(et => EventTypes[et])
      .forEach(et => this.eventsDictionary[et] = this.synagogue.events.filter(ev => {
        return ev.type == et;
      }));
  }

  getEventTypes(){
    return Object.keys(this.eventsDictionary);
  }

  toggleCollapse(eventsToShow){
    if(this.eventsToShow && this.eventsToShow == eventsToShow)
      this.eventsToShow = null;
    else
      this.eventsToShow = eventsToShow;
  }
}
