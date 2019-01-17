import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchEventPage } from './search-event';
import { ComponentsModule } from "../../components/components.module";
import { DirectivesModule } from "../../directives/directives.module";
import { SearchResultsViewComponent } from "../../components/search-results-view/search-results-view";


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from "@angular/common/http";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    SearchEventPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchEventPage),
    ComponentsModule,
    DirectivesModule,

    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  entryComponents: [SearchResultsViewComponent]
})
export class SearchEventPageModule { }
