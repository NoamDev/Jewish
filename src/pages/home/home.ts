import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SearchEventPage } from "../search-event/search-event";
import { NoScrollDirective } from "../../directives/no-scroll/no-scroll";
import { EventBasedMapObjectProvider } from "../../providers/server-providers/event-based-map-object.provider";
import { EventBasedMapObject } from "../../common/models/map-objects/map-objects";
import { Subject } from "rxjs/Subject";
import { SearchResultsViewComponent } from "../../components/search-results-view/search-results-view";
import { UserSettingsProvider } from "../../providers/user-settings/user-settings";
import { fromPromise } from "rxjs/observable/fromPromise";
import "rxjs/add/operator/zip";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NoScrollDirective]
})
export class HomePage {

  @ViewChild("resultsComp") resultsComponent: SearchResultsViewComponent;

  public nearMapObjects: Subject<EventBasedMapObject[]>;

  // private prevSearchedLocation: google.maps.LatLngLiteral;

  constructor(
    public navCtrl: NavController,
    private mapObjectProvider: EventBasedMapObjectProvider,
    private userSettings: UserSettingsProvider,
    public lngService: LanguageServiceProvider) {
    this.lngService.setLanguage();

    this.nearMapObjects = new Subject<EventBasedMapObject[]>();
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
      });
  }

  goToSearchPage() {
    this.navCtrl.push(SearchEventPage)
  }
}
