import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AddSynagoguePage} from './add-synagogue';
import {ComponentsModule} from "../../components/components.module";
import {PlaceAutoComplete} from "../../directives/place-autocomplete/place-autocomplete";
import {DirectivesModule} from "../../directives/directives.module";
import { TranslateServiceModule } from '../../app/translateService.module';

import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AddSynagoguePage,
  ],
  entryComponents: [],
  imports: [
    IonicPageModule.forChild(AddSynagoguePage),
    DirectivesModule,
    ComponentsModule,
    TranslateServiceModule,

    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [PlaceAutoComplete]
})
export class AddSynagoguePageModule {}
