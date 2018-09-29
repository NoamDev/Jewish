import {Event} from "./event";
import {EventTypes} from "../common/enums/event-types";
import {PrayerEvent} from "./prayer-event";

export class LessonEvent extends Event {
  title: string;

  constructor(){
    super();
    this.type = EventTypes.Lesson;
  }

  getEventName(): string {
    return this.title;
  }

  equals(other: LessonEvent): boolean {
    if (!(other instanceof LessonEvent) || other == null)
      return false;
    return super.equals(other) && this.title == other.title;
  }
}
