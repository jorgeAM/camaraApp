import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//MODAL
import { SubirPage } from "../subir/subir";
//FIREBASE
//import { AngularFireDatabase } from 'angularfire2/database';
//import { Observable } from 'rxjs/Observable';
//PROVIDER
import { CargaArchivoProvider } from "../../providers/carga-archivo/carga-archivo";
//PLUGIN
import { SocialSharing } from '@ionic-native/social-sharing';

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
    private cargaArchivoServicio: CargaArchivoProvider,
    private socialSharing: SocialSharing
  ) {
    //this.posts = this.afDB.list('post').valueChanges();
    this.misPosts = this.cargaArchivoServicio.imagenes;
   }

  mostrarModal(){
    this.modalCtrl.create(SubirPage).present();
  }

  compartir(post: any){
    this.convertToDataURLviaCanvas(post.img, "image/jpeg")
    .then(urlImagen => {
      let urlBase64 = String(urlImagen);
      this.socialSharing.shareViaFacebook(post.titulo, urlBase64, post.img)
      .then(() => console.log('compartido'))
      .catch((err) => console.log(err));
    }).catch(err => console.log(err));

    //console.log(post)
    //this.socialSharing.shareViaFacebook(post.titulo, post.img, post.img)
    //.then(() => console.log('compartido'))
    //.catch((err) => console.log(err));
  }

  convertToDataURLviaCanvas(url, outputFormat){
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        resolve(dataURL);
        canvas = null;
      };
      img.src = url;
    });
  }

  //evento de infinity scroll
  doInfinite(infiniteScroll) {
    this.cargaArchivoServicio.cargarImagenes().then((hayMas: boolean) => {
      hayMas ? infiniteScroll.complete() : this.hayMas = false;
    });

  }

}
