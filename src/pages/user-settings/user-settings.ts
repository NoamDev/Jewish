import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { UserSettingsProvider } from "../../providers/user-settings/user-settings";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';
import { HomePage } from '../../pages/home/home';
// import { GoogleMapComponent } from 'components/google-map/google-map';

interface UserSetting<T> {
  value: T;
  disabled: boolean;
}

interface UserSettings {
  rangeInHomePage: UserSetting<number>;
}

@IonicPage()
@Component({
  selector: 'page-user-settings',
  templateUrl: 'user-settings.html',
})
export class UserSettingsPage {

  currentSettings: UserSettings;
  loadProgress: Promise<void>;

  public lngSelect: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private settings: UserSettingsProvider,
    public lngService: LanguageServiceProvider,
    public events: Events,
    // public googleMapComponent: GoogleMapComponent,
  ) {

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');

    this.lngSelect = this.lngService.currentLng;

    this.currentSettings = {} as any;
    this.loadProgress = this.loadSettings();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSettingsPage');
  }

  ionViewCanEnter() {
    return this.loadProgress;
  }

  async loadSettings() {
    this.currentSettings.rangeInHomePage = await this.settings.getMaxRangeInHomePage();

    this.updateStatesForEeachSetting();
  }

  updateStatesForEeachSetting() {
    Object.keys(this.currentSettings).forEach(k => this.currentSettings[k] = {
      disabled: false,
      value: this.currentSettings[k]
    })
  }

  async saveRange(range: number) {
    this.currentSettings.rangeInHomePage.disabled = true;
    try {
      await this.settings.setMaxRangeInHomePage(range);
    } catch (e) {
      console.warn(e);
    }
    this.currentSettings.rangeInHomePage.disabled = false;
  }

  selectLanguage() {
    console.log(this.lngSelect);
    this.lngService.switchLanguage(this.lngSelect);

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');

    this.events.publish('user:created', "user", Date.now());

    // this.googleMapComponent.ngOnDestroy();
    // this.googleMapComponent.ngAfterViewInit();

    // window.location.reload();
  }
  back() {
    // this.navCtrl.pop();
    localStorage.setItem("enableReload", "enable")
    this.navCtrl.setRoot(HomePage);
  }
}
