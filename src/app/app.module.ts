import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ComponentsModule } from "../components/components.module";
import { Geolocation } from "@ionic-native/geolocation";
import { LocationPickerComponent } from "../components/location-picker/location-picker";
import { EventBasedMapObjectProvider } from '../providers/server-providers/event-based-map-object.provider';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { AddEventModalComponent } from "../components/add-event-modal/add-event-modal";
import { initializeGoogleMaps, initializeUserGeoposition } from "./app-initializers";
import { GoogleMapProvider } from "../providers/google-map/google-map-provider";
import { SynagogueDetailsPage } from "../pages/synagogue-details/synagogue-details";
import { SynagogueDetailsPageModule } from "../pages/synagogue-details/synagogue-details.module";
import { SearchEventPageModule } from "../pages/search-event/search-event.module";
import { LocationTrackingProvider } from '../providers/location-tracking/location-tracking';
import { AddSynagoguePageModule } from "../pages/add-synagogue/add-synagogue.module";
import { AddSynagoguePage } from "../pages/add-synagogue/add-synagogue";
import { DirectivesModule } from "../directives/directives.module";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { UserSettingsProvider } from '../providers/user-settings/user-settings';
import { UserSettingsPage } from "../pages/user-settings/user-settings";
import { UserSettingsPageModule } from "../pages/user-settings/user-settings.module";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageServiceProvider } from '../providers/language-service/language-service';
import { HomePageModule } from '../pages/home/home.module';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ComponentsModule,
    SynagogueDetailsPageModule,
    HomePageModule,
    AddSynagoguePageModule,
    DirectivesModule,
    SearchEventPageModule,
    UserSettingsPageModule,
    IonicModule.forRoot(MyApp, { scrollPadding: false, scrollAssist: false, autoFocusAssist: false }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SynagogueDetailsPage,
    AddSynagoguePage,
    UserSettingsPage,
    LocationPickerComponent,
    AddEventModalComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OpenNativeSettings,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EventBasedMapObjectProvider,
    GoogleMapProvider,
    { provide: APP_INITIALIZER, useFactory: initializeUserGeoposition, deps: [GoogleMapProvider], multi: true },
    LocationTrackingProvider,
    UserSettingsProvider,
    LaunchNavigator,
    ScreenOrientation,
    LocationAccuracy,
    LanguageServiceProvider
  ]
})
export class AppModule {
}
