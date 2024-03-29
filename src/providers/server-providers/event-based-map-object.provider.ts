import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractServerProvider } from "./abstract-server-provider";
import { catchError, retry } from "rxjs/operators";
import "rxjs/add/operator/map";
import { EventBasedMapObject, MapObject } from "../../common/models/map-objects/map-objects";
import { Observable } from "rxjs/Observable";
import LatLngLiteral = google.maps.LatLngLiteral;
import { SearchEvent } from "../../common/models/event/search-event";
import { Config } from "@app/env";
import { Synagogue } from "../../common/models/map-objects/synagogue";
import { GoogleMapProvider } from "../google-map/google-map-provider";

@Injectable()
export class EventBasedMapObjectProvider extends AbstractServerProvider {
  readonly baseUrl = `${ Config.serverBaseUrl }/synagogue`;

  constructor(private http: HttpClient,
    private googleMapProvider: GoogleMapProvider) {
    super();
  }

  create(mapObject: EventBasedMapObject, retryCount = 1) {
    return this.http
      .post<EventBasedMapObject>(this.baseUrl, mapObject.toServerModel())
      .pipe(
        retry(retryCount),
        catchError(this.handleError)
      );
  }

  update(model: EventBasedMapObject, retryCount = 1) {
    return this.http
      .put(`${ this.baseUrl }/${ model._id }`, model.toServerModel())
      .pipe(
        retry(retryCount),
        catchError(this.handleError)
      );
  }

  getAllInRadius(
    latLng: LatLngLiteral,
    radius: number
  ): Observable<Synagogue[]> {
    let query = new SearchEvent();
    query.mapObject = new MapObject({ latLng: latLng });
    query.radiusRange = 0;
    query.maxRadiusRange = radius;
    return this.getByQuery(query);
  }

  getByQuery(searchEvent: SearchEvent): Observable<Synagogue[]> {
    return this.http
      .post<any>(`${ this.baseUrl }/search`, searchEvent.toServerModel())
      .map(res => {
        return res.data.map((o: any) =>
          new Synagogue().fromServerModel(o)
        ) as Synagogue[];
      })
      .map(all => {
        all.forEach(
          s =>
            (s.relativeDistanceInMeter = new Promise<number>(resolve => {
              try {
                let distance =
                  this.googleMapProvider.getDistanceFromLatLonInKm(
                    searchEvent.mapObject.latLng,
                    s.latLng
                  ) * 1000;
                distance = Math.round(distance);
                resolve(distance);
              } catch (e) {
                console.warn(e);
                resolve(-1);
              }
            }))
        );
        return all;
      });
  }
}
