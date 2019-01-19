import {APP_INITIALIZER, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../components/components.module";
import {DirectivesModule} from "../../directives/directives.module";


import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
import {HomePage} from './home';
import {GoogleMapProvider} from "../../providers/google-map/google-map-provider";

import {initializeUserGeoposition} from "../../app/app-initializers";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
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
    providers: [
        // { provide: APP_INITIALIZER, useFactory: initializeGoogleMaps, multi: true },
        { provide: APP_INITIALIZER, useFactory: initializeUserGeoposition, deps: [GoogleMapProvider], multi: true },
    ],
    entryComponents: []
})
export class HomePageModule { }
