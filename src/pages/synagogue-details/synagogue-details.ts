import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Synagogue} from "../../common/models/map-objects/synagogue";
import {DatePipe} from "@angular/common";
import {FakeMapObject} from "../../common/data-faker/data-randomizer";
import {EventTypes} from "../../common/models/common/enums/event-types";
import {LessonEvent} from "../../common/models/event/lesson-event";
import {PrayerEvent} from "../../common/models/event/prayer-event";
import {AddSynagoguePage} from "../add-synagogue/add-synagogue";
import {LanguageServiceProvider} from '../../providers/language-service/language-service';

@IonicPage()
@Component({
  selector: 'page-synagogue-details',
  templateUrl: 'synagogue-details.html',
  providers: [DatePipe]
})
export class SynagogueDetailsPage {

  synagogue: Synagogue;
  relativeDistance: number;

  prayers: PrayerEvent[];
  lessons: LessonEvent[];

  soonestPrayer: PrayerEvent;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private changeDet: ChangeDetectorRef,
    public lngService: LanguageServiceProvider,
  ) {

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');

    this.synagogue = this.navParams.get('mapObject') as Synagogue || FakeMapObject() as Synagogue;
    this.prayers = this.getPrayers();
    this.lessons = this.getLessons() as LessonEvent[];
    this.soonestPrayer = this.synagogue.getSoonestEvent(EventTypes.Prayer);
    this.synagogue.relativeDistanceInMeter.then(val => {
      this.relativeDistance = val;
      this.changeDet.markForCheck();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynagogueDetailsPage');

  }

  private getPrayers() {
    return this.synagogue.events.filter(e => e.type == EventTypes.Prayer);
  }

  private getLessons() {
    return this.synagogue.events.filter(e => e.type == EventTypes.Lesson);
  }

  goToEditPage() {
    this.navCtrl.push(AddSynagoguePage, { synagogue: this.synagogue });
  }

  getPhoneNumber() {
    return (this.synagogue.phone && this.synagogue.phone.length > 0 && this.synagogue.phone[0]) || 'לא ידוע';
  }

  async goToDial() {

  }




}
