import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { Archivo } from '../../interfaces/archivo';

@Injectable()
export class CargaArchivoProvider {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello CargaArchivoProvider Provider');
  }

  cargarImagenFirebase(image: Archivo){
    let promesa = new Promise((resolve, reject) => {
      this.showToat('Cargando...');
      let storageRef = firebase.storage().ref();
      let nombreArchivo:string = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask =
        storageRef.child(`img/${nombreArchivo}`)
          .putString(image.img, 'base64' , { contentType: 'image/jpeg'});

      uploadTask.on('state_changed',
      () => {},
      (err) => {
        console.log(err);
        this.showToat('Hubo un error al subir archivo');
        reject(err);
      }, () => {
        console.log('archivo subido');
        this.showToat('Se subio la imagen correctamente');
        resolve(uploadTask.snapshot);
      });
    });

    return promesa;
  }

  cargarImagenAlternativo(image: Archivo){
    return new Promise((resolve, reject) => {
      this.showToat('Cargando...');
      let nombreArchivo:string = new Date().valueOf().toString();
      let storageRef = firebase.storage().ref('img/'+nombreArchivo+'.jpg')
      let uploadTask = storageRef.putString(image.img, 'data_url');

      uploadTask.on('state_changed',
      () => {},
      (err) => {
        console.log(err);
        this.showToat('Hubo un error al subir archivo');
        reject(err);
      },
      () => {
        console.log('archivo subido');
        this.showToat('Se subio la imagen correctamente');
        resolve(uploadTask.snapshot);
      }
      );
    });
  }

  showToat(mensaje:string){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

}
