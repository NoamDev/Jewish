import { CreateSynagogueOptions, SynagogueOptions } from "../common/enums/synagogue-option";
import { MapObject } from "../map-objects/map-objects";
import { keys } from "lodash-es";

export class SearchEvent {
  name: string;
  radiusRange = 0;
  maxRadiusRange = 0;
  mapObject: MapObject;
  startTime: Date;
  endTime: Date;
  daysRange: number[];
  synagogueOptions: SynagogueOptions;
  prayerNosach: string;

  constructor() {
    this.daysRange = [];
    this.mapObject = new MapObject();
    this.synagogueOptions = CreateSynagogueOptions();
  }

  toServerModel() {
    const model: any = {};
    if (this.name && this.name.length >= 2)
      model.name = this.name;
    if (this.mapObject) {
      if (this.mapObject.userFriendlyAddress)
        model.address = this.mapObject.userFriendlyAddress;
      if (this.mapObject.latLng && this.mapObject.latLng.lat && this.mapObject.latLng.lng) {
        model.lat = this.mapObject.latLng.lat;
        model.lon = this.mapObject.latLng.lng;
        model.min_radius = this.radiusRange;
        model.max_radius = this.maxRadiusRange;
      }
    }
    if (this.startTime)
      model.start_time = this.startTime.toString();
    if (this.endTime)
      model.end_time = this.endTime.toString();
    if (this.daysRange && this.daysRange.length > 0)
      model.days = this.daysRange;
    if (this.prayerNosach)
      model.nosach = this.prayerNosach;

    keys(this.synagogueOptions).forEach(k => {
      if (this.synagogueOptions[k] && this.synagogueOptions[k] == true)
        model[`externals.${ k }`] = true;
    });

    return model;
  }
}
