import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//MODAL
import { SubirPage } from "../subir/subir";
//FIREBASE
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private afDB: AngularFireDatabase
  ) {
    this.posts = this.afDB.list('post').valueChanges();
   }

  mostrarModal(){
    this.modalCtrl.create(SubirPage).present();
  }

}
