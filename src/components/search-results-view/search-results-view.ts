import {Component, Input, ViewChild} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {EventBasedMapObject, MapObject} from "../../common/models/map-objects/map-objects";
import {Observable} from "rxjs/Observable";
import {SynagogueDetailsPage} from "../../pages/synagogue-details/synagogue-details";
import {GoogleMapComponent} from "../google-map/google-map";
import {timeout} from "rxjs/operators";
import {of} from "rxjs/observable/of";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/merge";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Component({
  selector: 'fk-search-results-view',
  templateUrl: 'search-results-view.html'
})
export class SearchResultsViewComponent {

  @ViewChild('googleMap') googleMap: GoogleMapComponent;

  public activeSegment: string = 'map';

  private readonly _results: ReplaySubject<EventBasedMapObject[]>;
  canGoBack: any;

  @Input() set results(v: Observable<EventBasedMapObject[]>) {
    v.subscribe(res => this._results.next(res));
  }

  get results() {
    return this._results.asObservable();
  }

  constructor(private navParams: NavParams,
              private navCtrl: NavController) {
    console.log('Hello SearchResultsViewComponent Component');
    this._results = new ReplaySubject<EventBasedMapObject[]>(1);
    this.results = this.navParams.get('results') || of([]);
    this.canGoBack = this.navCtrl.canGoBack();
  }

  ngAfterViewInit(){
    this.registerDrawToMap();
  }

  private drawResultsOnMap(mapObjects: EventBasedMapObject[]) {
    mapObjects.forEach(async mObj => {
      let drawing = await this.googleMap.map.drawEventBasedMapObject(mObj);
      drawing.infoWindow.onClick.subscribe(async v => {
        await this.navCtrl.push(SynagogueDetailsPage, {mapObject: v.mapObject});
        drawing.infoWindow.close();
      })
    });
  }

  private registerDrawToMap(){
    this.googleMap.onMapCreated.pipe(timeout(60000)).take(1).subscribe(async () => {
      this.results.subscribe(res => {
        this.drawResultsOnMap(res);
      });
    }, err => {
      console.log('Timeout for create map expired' + err);
    });
  }
}
