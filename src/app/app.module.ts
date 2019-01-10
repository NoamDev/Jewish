import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { ComponentsModule } from "../components/components.module";
import { Geolocation } from "@ionic-native/geolocation";
import { Diagnostic } from "@ionic-native/diagnostic";
import { LocationPickerComponent } from "../components/location-picker/location-picker";
import { EventBasedMapObjectProvider } from "../providers/server-providers/event-based-map-object.provider";
import { HttpClientModule } from "@angular/common/http";
import { AddEventModalComponent } from "../components/add-event-modal/add-event-modal";
import { initializeGoogleMaps } from "./app-initializers";
import { GoogleMapProvider } from "../providers/google-map/google-map-provider";
import { SynagogueDetailsPage } from "../pages/synagogue-details/synagogue-details";
import { SynagogueDetailsPageModule } from "../pages/synagogue-details/synagogue-details.module";
import { SearchEventPageModule } from "../pages/search-event/search-event.module";
import { LocationTrackingProvider } from "../providers/location-tracking/location-tracking";
import { AddSynagoguePageModule } from "../pages/add-synagogue/add-synagogue.module";
import { AddSynagoguePage } from "../pages/add-synagogue/add-synagogue";
import { DirectivesModule } from "../directives/directives.module";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { UserSettingsProvider } from "../providers/user-settings/user-settings";
import { UserSettingsPage } from "../pages/user-settings/user-settings";
import { UserSettingsPageModule } from "../pages/user-settings/user-settings.module";
import { LaunchNavigator } from "@ionic-native/launch-navigator";
import { DoubleBackToExitProvider } from "../providers/double-back-to-exit/double-back-to-exit";

import { LocationAccuracy } from '@ionic-native/location-accuracy';

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    SynagogueDetailsPageModule,
    AddSynagoguePageModule,
    DirectivesModule,
    SearchEventPageModule,
    UserSettingsPageModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false,
      platforms: {
        ios: {
          backButtonText: 'חזרה'
        }
      }
    }),
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
    Diagnostic,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EventBasedMapObjectProvider,
    { provide: APP_INITIALIZER, useFactory: initializeGoogleMaps, multi: true },
    GoogleMapProvider,
    LocationTrackingProvider,
    UserSettingsProvider,
    LaunchNavigator,
    ScreenOrientation,
    LocationAccuracy,
    DoubleBackToExitProvider
  ]
})
export class AppModule { }
