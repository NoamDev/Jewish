import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormGroup} from "@angular/forms";
// import {CreateSynagogueValidator} from "../../models/synagogue/create-synagogue-validator";
// import {Synagogue} from "../../models/synagogue/synagogue";

/**
 * Generated class for the AddSynagoguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-synagogue',
  templateUrl: 'add-synagogue.html',
})
export class AddSynagoguePage {
  synagogueFormGroup: FormGroup;
  // synagogue: Synagogue;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.synagogue = new Synagogue();
    // this.synagogueFormGroup = CreateSynagogueValidator(this.synagogue);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSynagoguePage');
  }

}
