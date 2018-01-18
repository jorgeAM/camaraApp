import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
//PLUGINS
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

@IonicPage()
@Component({
  selector: 'page-subir',
  templateUrl: 'subir.html',
})
export class SubirPage {
  titulo: string;
  image: string;

  constructor(
    public viewCtrl: ViewController,
    private camera: Camera,
    private imagePicker: ImagePicker
  ) { }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  picker(){
    let opciones: ImagePickerOptions = {
      quality: 70,
      outputType: 1,
      maximumImagesCount: 1
    }

    this.imagePicker.getPictures(opciones).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.image = `data:image/jpeg;base64,${results[i]}`;
      }
    }, (err) => console.log(err) );
  }

  camara(){
    let opciones: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(opciones).then((imageData) => {
      this.image = `data:image/jpeg;base64,${imageData}`;
      console.log(this.image);
    }).catch(err => console.log("error: ", JSON.stringify(err)));
  }

}
