import {Component} from '@angular/core';
import {Event} from "../../common/models/event/event";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {StaticValidators} from "../../validators/static-validators";
import {ViewController} from "ionic-angular";
import {PrayerEvent} from "../../common/models/event/prayer-event";
import {EventTypes} from "../../common/models/common/enums/event-types";
import {PrintFormValidationErrors} from "../../common/models/common/utils";
import {LessonEvent} from "../../common/models/event/lesson-event";
import {PrayerType} from "../../common/models/common/enums/prayer-type";
import {LanguageServiceProvider} from '../../providers/language-service/language-service';
import moment = require("moment");

@Component({
  selector: 'fk-event-days-and-time-modal',
  templateUrl: 'add-event-modal.html',
})
export class AddEventModalComponent {

  event: Event;
  form: FormGroup;
  eventTypes: string[];

  constructor(private formBuilder: FormBuilder,
    public lngService: LanguageServiceProvider,
    private viewCtrl: ViewController) {
    console.log('Hello EventDaysAndTimeModalComponent Component');
    this.lngService.setLanguage();
    this.event = {} as any;
    this.eventTypes = this.getEventTypes();
    this.form = this.buildForm();
    this.eventTypes = this.lngService.setArrayLanguage(this.eventTypes);

    console.log(this.eventTypes);

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');

  }

  buildForm() {
    return this.formBuilder.group({
      eventType: ['', [Validators.required]]
    });
  }

  onFormSubmitted() {
    this.event.startTime = moment(this.event.startTime, "HH:mm").toDate();
    this.event.endTime = this.event.endTime && moment(this.event.endTime, "HH:mm").toDate();
    this.viewCtrl.dismiss(this.event);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  formatTimeRange(event: Event) {
    return event.formatTimeRange();
  }

  getEventTypes() {
    return Object.keys(EventTypes).map(k => EventTypes[k]);
  }

  getPrayerTypes() {
    return Object.keys(PrayerType).map(k => PrayerType[k]);
  }

  getErrors() {
    return PrintFormValidationErrors(this.form);
  }

  onEventTypeSelected(type: EventTypes) {
    switch (type) {
      case EventTypes.Lesson:
        this.event = new LessonEvent();
        this.form.addControl('lessonTitle', new FormControl('', [Validators.required]));
        break;
      case EventTypes.Prayer:
        this.event = new PrayerEvent();
        this.form.addControl('prayerType', new FormControl('', [Validators.required]));
        break;
    }
    this.event.repeatedDays = [];
    this.form.addControl('startsAt', new FormControl('', [StaticValidators.ValidDate('HH:mm'),
    StaticValidators.ValidDateIsBefore(() => this.event.endTime, "HH:mm")]));
    this.form.addControl('endsAt', new FormControl('', [StaticValidators.ValidDateIsAfter(() => this.event.startTime, "HH:mm")]));
    this.form.addControl('repeatedDays', new FormControl('', [StaticValidators.ArrayLengthInRange(1, 8)]));
  }

  ngOnDestroy() {
    Object.keys(this).forEach(k => delete this[k]);
  }
}
