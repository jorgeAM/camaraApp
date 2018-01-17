import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {
  titulo: string;

  constructor(public viewCtrl: ViewController) {
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
