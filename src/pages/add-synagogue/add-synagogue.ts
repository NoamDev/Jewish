import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {Synagogue} from "../../common/models/map-objects/synagogue";
import {EventBasedMapObjectProvider} from "../../providers/server-providers/event-based-map-object.provider";
import {Event} from "../../common/models/event/event";
import {AddEventModalComponent} from "../../components/add-event-modal/add-event-modal";
import {EventTypes} from "../../common/models/common/enums/event-types";
import {StaticValidators} from "../../validators/static-validators";
import {MapObject} from "../../common/models/map-objects/map-objects";
import {PlaceAutoComplete} from "../../directives/place-autocomplete/place-autocomplete";
import {LanguageServiceProvider} from '../../providers/language-service/language-service';

@IonicPage()
@Component({
  selector: 'page-add-synagogue',
  templateUrl: 'add-synagogue.html',
})
export class AddSynagoguePage {

  @ViewChild('placeAutoCompleteInput') placeAutoCompleteInput;
  @ViewChild(PlaceAutoComplete) placeAutoComplete: PlaceAutoComplete;
  @ViewChild('form') form: NgForm;

  phoneNumber: string;
  synagogue: Synagogue;
  eventsToShow: string;
  phonePattern = /^\d{2,3}-?\d{7}$/;
  eventsDictionary: { [type: string]: Event[] };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private changeDetector: ChangeDetectorRef,
    private mapObjectProvider: EventBasedMapObjectProvider,
    private modalCtrl: ModalController,
    public lngService: LanguageServiceProvider,
  ) {

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');

    console.log(this.lngService);

    this.synagogue = this.navParams.get('synagogue') as Synagogue || new Synagogue();
    console.log(this.synagogue);
    this.createEventsDictionary();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSynagoguePage');
    this.placeAutoComplete.mapObject = new Synagogue({ latLng: this.synagogue.latLng, userFriendlyAddress: this.synagogue.userFriendlyAddress });
  }

  async submitNewSynagogue() {
    try {
      await this.mapObjectProvider.create(this.synagogue).toPromise();
      this.toastCtrl.create({ message: 'בית הכנסת נוסף בהצלחה' });
    }
    catch (e) {
      this.toastCtrl.create({ message: 'אירעה שגיאה.. בית הכנסת לא נוצר', duration: 3000 }).present();
    }
  }

  async pickImage() {

  }

  openAddTimesModal() {
    const modal = this.modalCtrl.create(AddEventModalComponent, null, {
      enableBackdropDismiss: true,
      showBackdrop: true,
    });
    modal.onDidDismiss((data: Event) => {
      if (data == null)
        return;
      this.eventsDictionary[data.type].push(data);
      this.synagogue.events.push(data);
    });
    modal.present();
  }

  addPhoneNumber() {
    if (this.synagogue.phone.findIndex(p => p == this.phoneNumber) == -1)
      this.synagogue.phone.push(this.phoneNumber);
  }

  removePhone() {
    let index = this.synagogue.phone.findIndex(p => p == this.phoneNumber);
    this.synagogue.phone.splice(index, 1);
  }

  onModalClosed(mapObject: MapObject) {
    this.onMapObjectChanged(mapObject);
    this.placeAutoCompleteInput._native.nativeElement.value = this.synagogue.userFriendlyAddress;
  }

  onMapObjectChanged(mapObject: MapObject) {
    this.synagogue.userFriendlyAddress = mapObject.userFriendlyAddress;
    this.synagogue.latLng = mapObject.latLng;
    this.changeDetector.detectChanges();
  }

  isFormValid() {
    const mapObject = { latLng: this.synagogue.latLng, userFriendlyAddress: this.synagogue.userFriendlyAddress } as MapObject;
    let isMapObjectValid = StaticValidators.IsLocationValid(mapObject, true);
    return isMapObjectValid && this.form.valid;
  }

  formatTimeRange(event: Event) {
    return event.formatTimeRange();
  }

  removeEvent(event: Event) {
    let index = this.eventsDictionary[event.type].findIndex(ev => ev == ev);
    this.eventsDictionary[event.type].splice(index, 1);
    this.synagogue.events.splice(this.synagogue.events.findIndex(ev => ev == event), 1);
  }

  createEventsDictionary() {
    this.eventsDictionary = {};
    Object.keys(EventTypes).map(et => EventTypes[et])
      .forEach(et => this.eventsDictionary[et] = this.synagogue.events.filter(ev => {
        return ev.type == et;
      }));
      console.log(this.eventsDictionary);
  }

  getEventTypes() {
    return Object.keys(this.eventsDictionary);
  }

  toggleCollapse(eventsToShow) {
    if (this.eventsToShow && this.eventsToShow == eventsToShow)
      this.eventsToShow = null;
    else
      this.eventsToShow = eventsToShow;
  }
}
