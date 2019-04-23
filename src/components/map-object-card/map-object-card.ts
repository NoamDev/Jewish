import { Component, Input } from '@angular/core';
import { EventBasedMapObject } from "../../common/models/map-objects/map-objects";
import { EventTypes } from "../../common/models/common/enums/event-types";
import moment = require("moment");
import { NavController } from "ionic-angular";
import { SynagogueDetailsPage } from "../../pages/synagogue-details/synagogue-details";
import { PrayerEvent } from "../../common/models/event/prayer-event";
import { LessonEvent } from "../../common/models/event/lesson-event";
import { Event } from "../../common/models/event/event";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'fk-map-object-card',
  templateUrl: 'map-object-card.html'
})
export class MapObjectCardComponent {

  private _mapObject: EventBasedMapObject;
  relativeDistance: number;

  get mapObject(): EventBasedMapObject {
    return this._mapObject;
  }

  @Input() set mapObject(value: EventBasedMapObject) {
    this._mapObject = value;
    this._mapObject.relativeDistanceInMeter.then(val => {
      this.relativeDistance = val;
    });
    this.soonestEvent = this.mapObject.getSoonestEvent(EventTypes.Prayer);
  }

  prayers: PrayerEvent[];
  lessons: LessonEvent[];

  soonestEvent: Event;

  constructor(
    private navCtrl: NavController,
    public lngService: LanguageServiceProvider,
  ) {
    console.log('Hello EventCardComponent Component');

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');
  }

  goToPageDetails() {
    this.navCtrl.push('SynagogueDetailsPage', { mapObject: this._mapObject }, {
      direction: 'up'
    })
  }
}
