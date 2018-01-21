import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { Archivo } from '../../interfaces/archivo';
import 'rxjs/add/operator/map';

@Injectable()
export class CargaArchivoProvider {
  imagenes: Archivo[] = [];
  lastKey:string = null;

  constructor(
    public toastCtrl: ToastController,
    public afDB: AngularFireDatabase
  ) {
    this.cargarUltimaKey().subscribe(() => this.cargarImagenes());
  }

  private cargarUltimaKey(){
    //retorna un Obsrvable, lo tendremos que convertir con map
    return this.afDB.list('/post', ref => ref.orderByKey().limitToLast(1))
        .valueChanges().map((post: any) => {
          console.log(post);
          this.lastKey = post[0].key;
          this.imagenes.push(post[0]);
        });
  }

  cargarImagenes(){
    return new Promise((resolve, reject) => {
      this.afDB.list('/post',
        ref => ref.limitToLast(3).orderByKey()
          .endAt(this.lastKey)
      ).valueChanges()
      .subscribe((posts: any) => {
        posts.pop();
        if(posts.length == 0){
          console.log('Ya no hay más registros');
          resolve(false);
          return;
        }
        this.lastKey = posts[0].key;
        for(let j = posts.length-1; j >= 0; j--){
          let post = posts[j];
          this.imagenes.push(post);
        }
        resolve(true)
      });
    });
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

        let url = uploadTask.snapshot.downloadURL;

        this.crearPost(image.titulo, url ,nombreArchivo)
        resolve(uploadTask.snapshot);
      });
    });

    return promesa;
  }

  /*
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
      });
    });
  }
  */

  private crearPost(titulo:string, url:string, nombreArchivo:string){
    let post: Archivo = {
      img: url,
      titulo: titulo,
      key: nombreArchivo
    };

    //metodo pero que crea un id propio de firebase
    //this.afDB.list('/post').push(post);
    //metodo para subir y listar primero
    //this.afDB.database.ref('post').push(post)
    //metodo para asignarle la key que queremos
    this.afDB.object(`/post/${nombreArchivo}`).update(post);
    this.imagenes.push(post);

  }

  showToat(mensaje:string){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

}
