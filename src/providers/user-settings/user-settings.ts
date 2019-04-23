import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Subject } from "rxjs/Subject";

export type UserSettingsAvailable = 'maxRangeInHomePage';

@Injectable()
export class UserSettingsProvider {

  subscriptions: { [settingName: string]: Subject<any> };

  constructor(private storage: Storage) {
    this.subscriptions = {};
  }

  async getMaxRangeInHomePage() {
    const defaultRange = 1;
    try {
      let value = await this.storage.get('maxRangeInHomePage');
      return value || defaultRange;
    }
    catch (e) {
      console.warn(e);
      return defaultRange;
    }
  }

  async setMaxRangeInHomePage(value: number) {
    await this.storage.set('maxRangeInHomePage', value);
    this.notifyOnChange("maxRangeInHomePage", value);
  }

  registerToSettingChange(settingName: UserSettingsAvailable) {
    this.subscriptions[settingName] = new Subject<any>();
    return this.subscriptions[settingName];
  }

  private notifyOnChange(key: UserSettingsAvailable, value) {
    const subject = this.subscriptions[key];
    if (subject && subject.observers.length > 0)
      subject.next(value);
    if (subject && subject.observers.length == 0) {
      subject.complete();
      delete this.subscriptions[key];
    }
  }
}
