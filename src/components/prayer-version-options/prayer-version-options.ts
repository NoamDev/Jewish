import { Component, Input, ViewChild } from '@angular/core';
import { PrayerNosach } from "../../common/models/common/enums/prayer-nosach";
import { AbstractValueAccessor, MakeProvider } from "../../common/component-helpers/abstract-value-accessor";
import { Select } from "ionic-angular";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'fk-prayer-version-options',
  templateUrl: 'prayer-version-options.html',
  providers: [MakeProvider(PrayerVersionOptionsComponent)]
})
export class PrayerVersionOptionsComponent extends AbstractValueAccessor {

  @ViewChild('selectComponent') private selectComponent: Select;

  @Input()
  allowMultiple: boolean;

  @Input()
  title: string;

  @Input()
  placeholder: string;

  @Input()
  label: string;

  @Input()
  versions: string[];

  constructor(
    public lngService: LanguageServiceProvider,
  ) {
    super();

    this.lngService.setLanguage();

    this.lngService.currentLng = localStorage.getItem('currentLng');
    this.lngService.direction = localStorage.getItem('direction');
    console.log(this.lngService);

    console.log('Hello PrayerVersionOptionsComponent Component');
    this.versions = Object.keys(PrayerNosach).map(key => PrayerNosach[key]);
    this.versions = this.lngService.setArrayLanguage(this.versions);
  }

  ngAfterViewInit() {
    this.selectComponent.okText = this.lngService.getOneLanguage('select');
    this.selectComponent.cancelText = this.lngService.getOneLanguage('void');
    this.selectComponent.selectOptions = {
      title: this.title
    };
  }
}
