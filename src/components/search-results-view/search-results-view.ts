import { Component, Input, ViewChild } from '@angular/core';
import { NavController, NavParams } from "ionic-angular";
import { EventBasedMapObject, MapObject } from "../../common/models/map-objects/map-objects";
import { Observable } from "rxjs/Observable";
import { SynagogueDetailsPage } from "../../pages/synagogue-details/synagogue-details";
import { GoogleMapComponent } from "../google-map/google-map";
import { timeout } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import "rxjs/add/operator/merge";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { InfoWindow } from "../../providers/google-map/info-window";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'fk-search-results-view',
  templateUrl: 'search-results-view.html'
})
export class SearchResultsViewComponent {

  private currentMarkersAndInfoWindows: { markers: google.maps.Marker[], info: InfoWindow[] };
  private readonly _results: ReplaySubject<EventBasedMapObject[]>;

  @ViewChild('googleMap') googleMap: GoogleMapComponent;
  activeSegment: string = 'map';
  canGoBack: any;

  @Input() mapOptions: google.maps.MapOptions;

  @Input() set results(v: Observable<EventBasedMapObject[]>) {
    v.subscribe(res => {
      this._results.next(res)
    });
  }

  get results() {
    return this._results.asObservable();
  }

  constructor(private navParams: NavParams,
    private navCtrl: NavController,
    public lngService: LanguageServiceProvider,
  ) {
    console.log('Hello SearchResultsViewComponent Component');
    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');
    
    this._results = new ReplaySubject<EventBasedMapObject[]>(1);
    this.results = this.navParams.get('results') || of([]);
    this.mapOptions = this.navParams.get('mapOptions') || of([]);
    this.canGoBack = this.navCtrl.canGoBack();
    this.currentMarkersAndInfoWindows = { info: [], markers: [] };
  }

  ngAfterViewInit() {
    this.registerDrawToMap();
  }

  private drawResultsOnMap(mapObjects: EventBasedMapObject[]) {
    mapObjects.forEach(async mObj => {
      let drawing = await this.googleMap.map.drawEventBasedMapObject(mObj);
      this.currentMarkersAndInfoWindows.markers.push(drawing.marker);
      this.currentMarkersAndInfoWindows.info.push(drawing.infoWindow);
      drawing.infoWindow.onClick.subscribe(async v => {
        await this.navCtrl.push(SynagogueDetailsPage, { mapObject: v.mapObject });
        drawing.infoWindow.close();
      })
    });
  }

  private registerDrawToMap() {
    this.googleMap.onMapCreated.pipe(timeout(60000)).take(1).subscribe(async () => {
      this.results.subscribe(res => {
        this.removedPreviousResults();
        this.drawResultsOnMap(res);
      });
    }, err => {
      console.log('Timeout for create map expired' + err);
    });
  }

  private removedPreviousResults() {
    this.currentMarkersAndInfoWindows.markers.forEach(marker => marker.setMap(null));
    this.currentMarkersAndInfoWindows.markers = [];
    this.currentMarkersAndInfoWindows.info.forEach(info => info.dispose());
    this.currentMarkersAndInfoWindows.info = [];
  }
}
