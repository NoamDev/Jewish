import { Component, Output, EventEmitter } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { EventBasedMapObjectProvider } from "../../providers/server-providers/event-based-map-object.provider";
import { Synagogue } from '../../common/models/map-objects/synagogue';
import { SearchEvent } from '../../common/models/event/search-event';

@Component({
    selector: 'select-search',
    templateUrl: 'select-search.html',
})
export class SelectSearch {
    SearchedSynagogues: Synagogue[] = [];
    synagogueName: string;
    @Output() onSynagoguePicked: EventEmitter<Synagogue> = new EventEmitter();

    constructor(private toastCtrl: ToastController,
        private mapObjectProvider: EventBasedMapObjectProvider) {
    }

    async onInputChanged(event) {
        const text: string = event.target.value;
        this.synagogueName = text;
        if (!text || text.length < 2) {
            this.SearchedSynagogues = [];
            return;
        }
        try {
            let search = new SearchEvent();
            search.name = text;
            this.mapObjectProvider.getByQuery(search).subscribe(synagogues => {
                this.SearchedSynagogues = synagogues;
            });
        }
        catch (e) {
            this.toastCtrl.create({ message: e.error, duration: 3000 }).present();
        }
    }

    onClick(synagogue) {
        this.synagogueName = synagogue.name;
        this.SearchedSynagogues = [];
        this.onSynagoguePicked.emit(synagogue);
    }
}