import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//MODAL
import { SubirPage } from "../subir/subir";
//FIREBASE
//import { AngularFireDatabase } from 'angularfire2/database';
//import { Observable } from 'rxjs/Observable';
//PROVIDER
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //posts: Observable<any[]>;
  misPosts: any;
  hayMas: boolean = true;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    //private afDB: AngularFireDatabase,
    private cargaArchivoServicio: CargaArchivoProvider
  ) {
    //this.posts = this.afDB.list('post').valueChanges();
    this.misPosts = this.cargaArchivoServicio.imagenes;
   }

  mostrarModal(){
    this.modalCtrl.create(SubirPage).present();
  }

  //evento de infinity scroll
  doInfinite(infiniteScroll) {
    this.cargaArchivoServicio.cargarImagenes().then((hayMas: boolean) => {
      hayMas ? infiniteScroll.complete() : this.hayMas = false;
    });

  }

}
