import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { LanguageServiceProvider } from '../../providers/language-service/language-service';

@Component({
  selector: 'distance-navigation-button',
  templateUrl: 'distance-navigation-button.html'
})
export class DistanceNavigationButtonComponent {

  @Input() relativeDistance: number;
  @Input() destination: string;

  constructor(
    private launchNavigator: LaunchNavigator,
    public lngService: LanguageServiceProvider) {
    this.lngService.setLanguage();
  }

  launchNavigation() {
    this.launchNavigator.navigate(this.destination);
  }
}
