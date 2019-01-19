import {Event} from "../event/event";
import {PrayerNosach} from "../common/enums/prayer-nosach";
import {isArray} from "lodash-es";
import {MapObjectTypes} from "../common/enums/map-object-types";
import {CreateSynagogueOptions, SynagogueOptions} from "../common/enums/synagogue-option";
import {PrayerEvent} from "../event/prayer-event";
import {EventBasedMapObject} from "./map-objects";
import {EventTypes} from "../common/enums/event-types";
import {LessonEvent} from "../event/lesson-event";
import LatLngLiteral = google.maps.LatLngLiteral;

export class Synagogue extends EventBasedMapObject {
  _id: string;
  latLng: LatLngLiteral;
  userFriendlyAddress: string;
  type = MapObjectTypes.Synagogue;
  name: string;
  primaryPrayerNosach: PrayerNosach;
  events: Array<Event> = [];
  phone: string[] = [];
  synagogueOptions: SynagogueOptions = CreateSynagogueOptions();
  picture: string;
  comments: string;

  fromServerModel(sm: any) {
    this._id = sm.syn_id;
    this.name = sm.name;
    this.latLng = {lat: sm.location.coordinates[1], lng: sm.location.coordinates[0]};
    this.userFriendlyAddress = sm.address;
    this.synagogueOptions = sm.externals;
    this.picture = sm.image;
    this.phone = sm.phone_number || [];
    this.primaryPrayerNosach = sm.nosahc;
    this.comments = sm.comments;

    const prayers = (sm.minyans && isArray(sm.minyans) && sm.minyans.map(m => {
      m.nosach = m.nosach || sm.nosach;
      return new PrayerEvent().fromServerModel(m)
    })) || [];
    const lessons = (sm.lessons && isArray(sm.lessons) && sm.lessons.map(l => new LessonEvent().fromServerModel(l))) || [];

    this.events = prayers.concat(lessons);

    return this;
  }

  toServerModel(): any {
    return {
      _id: this._id,
      name: this.name,
      address: this.userFriendlyAddress,
      location: {coordinates: [this.latLng.lng, this.latLng.lat], type: "Point"},
      nosach: this.primaryPrayerNosach,
      phone_number: this.phone,
      // image: this.picture,
      minyans: this.events.filter(e => e.type == EventTypes.Prayer),
      lessons: this.events.filter(e => e.type == EventTypes.Lesson),
      comments: this.comments,
      externals: {
        accessibility: this.synagogueOptions
      }
    }
  }

  isEventExist(event: Event) {
    // return this.events.find(ev => ev.title == event.title) != null;
    return false;
  }
}
