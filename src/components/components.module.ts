import { NgModule } from '@angular/core';
import { GoogleMapComponent } from './google-map/google-map';
import { IonicModule } from "ionic-angular";
import { LocateButtonComponent } from './locate-button/locate-button';
import { SelectSearch } from './select-search/select-search';
import { SearchEventButtonComponent } from './search-event-button/search-event-button';
import { ApplicationMenuComponent } from './application-menu/application-menu';
import { PrayerVersionOptionsComponent } from './prayer-version-options/prayer-version-options';
import { LocationPickerComponent } from './location-picker/location-picker';
import { DayRangeComponent } from './day-range/day-range';
import { SynagogueOptionsComponent } from "./synagogue-options/synagogue-options";
import { DirectivesModule } from "../directives/directives.module";
import { AddEventModalComponent } from "./add-event-modal/add-event-modal";
import { MapObjectsListComponent } from "./map-objects-list/map-objects-list.component";
import { MapObjectCardComponent } from "./map-object-card/map-object-card";
import { SearchResultsViewComponent } from './search-results-view/search-results-view';
import { DistanceNavigationButtonComponent } from './distance-navigation-button/distance-navigation-button';
import { PipesModule } from "../pipes/pipes.module";

import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    GoogleMapComponent,
    MapObjectsListComponent,
    MapObjectCardComponent,
    LocateButtonComponent,
    SelectSearch,
    SearchEventButtonComponent,
    ApplicationMenuComponent,
    SynagogueOptionsComponent,
    PrayerVersionOptionsComponent,
    LocationPickerComponent,
    DayRangeComponent,
    AddEventModalComponent,
    SearchResultsViewComponent,
    DistanceNavigationButtonComponent
  ],
  imports: [
    IonicModule, DirectivesModule, PipesModule,

    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  entryComponents: [],
  exports: [
    GoogleMapComponent,
    MapObjectsListComponent,
    MapObjectCardComponent,
    LocateButtonComponent,
    SelectSearch,
    SearchEventButtonComponent,
    ApplicationMenuComponent,
    SynagogueOptionsComponent,
    PrayerVersionOptionsComponent,
    LocationPickerComponent,
    DayRangeComponent,
    AddEventModalComponent,
    SearchResultsViewComponent,
    DistanceNavigationButtonComponent
  ]
})
export class ComponentsModule { }
