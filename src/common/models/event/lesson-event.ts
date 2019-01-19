import {Event} from "./event";
import {EventTypes} from "../common/enums/event-types";

export class LessonEvent extends Event {
  title: string;

  constructor(){
    super();
    this.type = EventTypes.Lesson;
  }

  toServerModel(){
    const model = super.toServerModel();
    model.name = this.title;
    return model;
  }

  fromServerModel(sm: any){
    super.fromServerModel(sm);
    this.title = sm.name;
    return this;
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
