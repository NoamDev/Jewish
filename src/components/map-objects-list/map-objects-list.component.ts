import { Component, Input } from '@angular/core';
import { EventBasedMapObject } from "../../common/models/map-objects/map-objects";
import { FakeMapObject } from "../../common/data-faker/data-randomizer";
import { Observable } from "rxjs/Observable";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'fk-map-objects-list',
  templateUrl: 'map-objects-list.component.html'
})
export class MapObjectsListComponent {

  @Input() mapObjects: Observable<EventBasedMapObject[]>;

  constructor(
    public lngService: LanguageServiceProvider,
  ) {
    console.log('Hello EventsListComponent Component');

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');
  }

}
