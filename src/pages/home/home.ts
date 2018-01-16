import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//MODAL
import { SubirPage } from "../subir/subir";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) { }

  mostrarModal(){
    this.modalCtrl.create(SubirPage).present();
  }

}
