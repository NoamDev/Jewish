import {Event} from "./event";
import {PrayerNosach} from "../common/enums/prayer-nosach";
import {PrayerTypes} from "../common/enums/prayer-types";
import {EventTypes} from "../common/enums/event-types";

export class PrayerEvent extends Event {

  nosach: PrayerNosach;
  types: PrayerTypes;

  constructor(){
    super();
    this.type = EventTypes.Prayer;
  }

  getEventName(): string {
    return "תפילת " + this.types;
  }
}
