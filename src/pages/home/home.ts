import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { SearchEventPage } from "../search-event/search-event";
import { AddSynagoguePage } from "../add-synagogue/add-synagogue";
import { NoScrollDirective } from "../../directives/no-scroll/no-scroll";
import { EventBasedMapObjectProvider } from "../../providers/server-providers/event-based-map-object.provider";
import { EventBasedMapObject } from "../../common/models/map-objects/map-objects";
import { LocationTrackingProvider } from "../../providers/location-tracking/location-tracking";
import { Subject } from "rxjs/Subject";
import { SearchResultsViewComponent } from "../../components/search-results-view/search-results-view";
import { UserSettingsPage } from "../user-settings/user-settings";
import { UserSettingsProvider } from "../../providers/user-settings/user-settings";
import { fromPromise } from "rxjs/observable/fromPromise";
import "rxjs/add/operator/zip";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

const EarthRadiusInKm = 6378

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NoScrollDirective]
})
export class HomePage {

  @ViewChild("resultsComp") resultsComponent: SearchResultsViewComponent;

  public nearMapObjects: Subject<EventBasedMapObject[]>;

  // private prevSearchedLocation: google.maps.LatLngLiteral;

  constructor(public navCtrl: NavController,
    private locationTracking: LocationTrackingProvider,
    private mapObjectProvider: EventBasedMapObjectProvider,
    private userSettings: UserSettingsProvider,
    private navParams: NavParams,
    private platform: Platform,
    public lngService: LanguageServiceProvider,
    private alertController: AlertController) {
    this.lngService.setLanguage();

    console.log(this.lngService.currentLng);

    this.platform.registerBackButtonAction(() => {
      alertController.create({
        buttons: [{ text: "Yes", handler: () => this.platform.exitApp() }, { text: "No" }],
        title: "Close",
        subTitle: "Are you sure you want to exit the app?"
      });
    });
    this.nearMapObjects = new Subject<EventBasedMapObject[]>();
    console.log(this.nearMapObjects);
  }

  ngAfterViewInit() {
    this.resultsComponent.googleMap.onMapCreated.zip(fromPromise(this.userSettings.getMaxRangeInHomePage()))
      .flatMap(zip => {
        const mapCenter = zip[0].map.getCenter().toJSON();
        this.registerToRangeChanges(mapCenter);
        return this.mapObjectProvider.getAllInRadius(mapCenter, zip[1]);
      }).subscribe(res => {
        if (res.length > 0)
          this.nearMapObjects.next(res);
        console.log(this.nearMapObjects);
      });
  }

  registerToRangeChanges(mapCenter: google.maps.LatLngLiteral) {
    this.userSettings.registerToSettingChange('maxRangeInHomePage')
      .debounceTime(1500)
      .distinctUntilChanged()
      .flatMap(range => {
        return this.mapObjectProvider.getAllInRadius(mapCenter, range);
      }).subscribe(res => {
        if (res.length > 0)
          this.nearMapObjects.next(res);
        console.log(this.nearMapObjects);
      });
  }

  goToSearchPage() {
    this.navCtrl.push(SearchEventPage)
  }

  goToAddSynagoguePage() {
    this.navCtrl.push(AddSynagoguePage)
  }

  goToUserSettings() {
    // this.navCtrl.pop();
    this.navCtrl.push(UserSettingsPage);
  }
}
