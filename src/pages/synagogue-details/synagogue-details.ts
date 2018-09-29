import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Synagogue} from "../../common/models/map-objects/synagogue";
import {EventBasedMapObjectProvider} from "../../providers/server-providers/event-based-map-object.provider";
import {Event} from "../../common/models/event/event";
import {DatePipe} from "@angular/common";
import {FakeMapObject} from "../../common/data-faker/data-randomizer";
import {EventTypes} from "../../common/models/common/enums/event-types";
import {EventBasedMapObject} from "../../common/models/map-objects/map-objects";
import {LessonEvent} from "../../common/models/event/lesson-event";
import {PrayerEvent} from "../../common/models/event/prayer-event";
import {AddSynagoguePage} from "../add-synagogue/add-synagogue";

@IonicPage()
@Component({
  selector: 'page-synagogue-details',
  templateUrl: 'synagogue-details.html',
  providers: [DatePipe]
})
export class SynagogueDetailsPage {

  synagogue: Synagogue;

  prayers: PrayerEvent[];
  lessons: LessonEvent[];

  soonestPrayer: PrayerEvent;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private datePipe: DatePipe,
              private provider:  EventBasedMapObjectProvider) {
    this.synagogue = this.navParams.get('mapObject') as Synagogue || FakeMapObject() as Synagogue;
    this.prayers = this.getPrayers();
    this.lessons = this.getLessons() as LessonEvent[];
    this.soonestPrayer = this.synagogue.getSoonestEvent(EventTypes.Prayer);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SynagogueDetailsPage');
  }

  private getPrayers(){
    return this.synagogue.events.filter(e => e.type == EventTypes.Prayer);
  }

  private getLessons(){
    return this.synagogue.events.filter(e => e.type == EventTypes.Lesson);
  }

  goToEditPage() {
    this.navCtrl.push('AddSynagoguePage',{synagogue: this.synagogue});
  }
}
