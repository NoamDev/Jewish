import {ServerModel} from "../common/server-model";
import {assign, isEqual, merge} from "lodash-es";
import moment = require("moment");
import {EventTypes} from "../common/enums/event-types";

export abstract class Event extends ServerModel{
  type: EventTypes;
  startTime: Date;
  endTime: Date;
  repeatedDays: number[];
  verifiedRecentlyAt: Date;
  dateMembers = ['startTime','endTime', 'verifiedRecentlyAt'];

  protected constructor() {
    super();
    this.repeatedDays = [];
  }

  abstract getEventName(): string;

  fromServerModel(sm: any){
    this.startTime = moment(sm.hour,"hh:mm").toDate();
    this.endTime = sm.endTime && moment(sm.endTime,"hh:mm").toDate();
    this.repeatedDays = sm.days;
    this.verifiedRecentlyAt = moment(sm.last_verified_at, "dd/mm/yyyy").toDate();
    return this;
  }

  toServerModel(): any{
    return {
      days: this.repeatedDays,
      verifiedRecentlyAt: moment(this.verifiedRecentlyAt).format(""),
      hour: moment(this.startTime).format("hh:mm"),
      endTime: this.endTime && moment(this.endTime).format("hh:mm"),
    };
  }

  equals(other: any): boolean {
    return this.type == other.type &&
      this.startTime.getTime() == other.startTime.getTime() &&
      (this.endTime != null && other.endTime != null && this.endTime.getTime() == other.endTime.getTime()) &&
      isEqual(this.repeatedDays, other.repeatedDays);
  }

  public formatTimeRange(format="hh:mm"){
    let formatted = '';
    if (this.isValidDate(this.startTime))
      formatted = moment(this.startTime).format(format);
    if (this.isValidDate(this.endTime))
      formatted += ` - ${moment(this.endTime).format(format)}`;
    return formatted != '' ? formatted : 'לא ידוע';
  }

  public isTimeRangeValid(){
    return this.isValidDate(this.startTime)
  }

  public formatDaysArray(){
    if (this.repeatedDays.length == 1)
      return this.formatDaysToHebrewAbbr();
    let arr = this.repeatedDays.slice().sort();
    let prev = arr[0];
    if (arr.every(day => {
      let isLessThanNext = day - prev <= 1;
      prev = day;
      return isLessThanNext;
    })) {
      let hebAbbr = this.formatDaysToHebrewAbbr(arr);
      return `${hebAbbr[0]} - ${hebAbbr[arr.length-1]}`;
    }
    else {
      return this.formatDaysToHebrewAbbr(arr).join(', ');
    }
  }

  public formatDaysToHebrewAbbr(arr?: number[]){
    const days = ['א','ב','ג','ד','ה','ו','ש']
    return (arr || this.repeatedDays).map(d => {
      return days[d-1];
    })
  }

  private isValidDate(d){
    return d instanceof Date && !isNaN(d as any);
  }
}
