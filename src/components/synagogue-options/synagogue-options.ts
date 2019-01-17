import { Component } from '@angular/core';
import {
  CreateSynagogueOptions,
  SynagogueOption,
  TranslateSynagogueOption
} from "../../common/models/common/enums/synagogue-option";
import { AbstractValueAccessor, MakeProvider } from "../../common/component-helpers/abstract-value-accessor";
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'fk-synagogue-options',
  templateUrl: 'synagogue-options.html',
  providers: [MakeProvider(SynagogueOptionsComponent)]
})
export class SynagogueOptionsComponent extends AbstractValueAccessor {

  private readonly selectedOptions: { [option: string]: boolean | null };

  constructor(
    public lngService: LanguageServiceProvider
  ) {
    super();
    console.log('Hello AccessibilityOptionsComponent Component');
    this.selectedOptions = CreateSynagogueOptions();
  }

  isOptionChecked(accessibility: string) {
    return this.selectedOptions[accessibility] == true;
  }

  onSelectionChanged(option: string) {
    this.selectedOptions[option] = (this.isOptionChecked(option) ? null : true);
    this.value = this.selectedOptions;
  }

  getOptionsList() {
    return Object.keys(SynagogueOption).filter(opt => isNaN(opt as any)).map(opt => ({
      opt: opt,
      translation: this.lngService.getOneLanguage(TranslateSynagogueOption(SynagogueOption[opt]))
    }))
  }
}
