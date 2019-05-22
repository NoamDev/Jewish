import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSettingsPage } from './user-settings';
import { IonicStorageModule } from "@ionic/storage";

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from "@angular/common/http";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    UserSettingsPage,
  ],
  imports: [
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    IonicPageModule.forChild(UserSettingsPage),

    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class UserSettingsPageModule {
}
