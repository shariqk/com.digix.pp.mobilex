import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MsvisionApiProvider } from '../../providers/msvision-api/msvision-api';
import { MSVisionApiResult, MSVisionOcrResult, Line } from '../../providers/msvision-api/msvision-api.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  base64Image : string = null;
  analysis : MSVisionApiResult = null;
  ocr: MSVisionOcrResult = null;
  testImageUrl = 'https://media.istockphoto.com/photos/nexium-24hr-14-capsules-bottle-picture-id504539501?k=6&m=504539501&s=612x612&w=0&h=QcNT8-vEsUb01NkqZUHoaAdjySBLt_VVBIP8RJscycM=';
  working: boolean = false;

  keywords: string[] = [
    'full spectrum',
    'CBD',
    'cannabidiol',
    'phytocannabinoids',
    'hemp',
    'extract',
    'leaves',
    'flowers',
    'natural terpenes'
  ];

  constructor(public navCtrl: NavController,
    public msvisionApi : MsvisionApiProvider,

    public camera : Camera) {

  }


  async scanAndAnalyzeLabel(useTestData: boolean) {
    /*
    let imageData = null;
    if(useTestData) {
      try {
        imageData = await this.msvisionApi.downloadImageAsync(this.testImageUrl);
      }
      catch (err) {
        console.log('err', err);
        alert('Error occured while downloading test data: ' + JSON.stringify(err));
        return;
      }
    }
    else {
      try {
        imageData = await this.takePicture();
        if(imageData == null) { return; }
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }
      catch (err) {
        alert('Error occured while accessing camera: ' + JSON.stringify(err));
        return;
      }
    }
    */
    let imageData = null;
    try {
      imageData = await this.takePicture();
      if(imageData == null) { return; }
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }
    catch (err) {
      // likely cordova_not_available
      alert('Error occured while accessing camera: ' + JSON.stringify(err));
      return;
    }

    // clear out previouse settings
    this.ocr = null;
    this.analysis = null;

    try {
      this.working = true;
      this.analysis = await this.msvisionApi.analyzeImageDataAsync(imageData);
      this.ocr = await this.msvisionApi.ocrImageDataAsync(imageData);
      //console.log(this.ocr);
    }
    catch (err) {
      alert('Error occured while analyzing data: ' + JSON.stringify(err));
    }
    finally {
      this.working = false;
    }
  }


  async useTestImageToAnalyze() {


    try {
      this.working = true;

        //'https://c8.alamy.com/comp/ADN09E/label-on-prescription-medicine-bottle-for-nexium-ADN09E.jpg';// 'https://www.medixcbd.com/wp-content/uploads/2018/03/label-1.png';
      this.base64Image = this.testImageUrl;

      this.analysis = await this.msvisionApi.analyzeImageUrlAsync(this.testImageUrl);
      this.ocr = await this.msvisionApi.ocrImageUrlAsync(this.testImageUrl);
      console.log(this.ocr);
    }
    catch (err) {
      alert('Error occured while analyzing data: ' + JSON.stringify(err));
    }
    finally {
      this.working = false;
    }


  }

  concatWords(line: Line): string {
    let result = '';
    for(let w of line.words) {
      if(result.length>0) {
        result += ', ';
      }
      result += w.text;
    }
    return result;
  }

  formatPercentage(num : number) {
      return Math.floor(num * 100) + '%';
    }

  toJSONString(obj : object) {
    return obj!=null ? JSON.stringify(obj) : "";
  }

  formatTags(tags : string[]) : string {
    let str = '';
    for(var t of tags) {
      str += (str.length > 0 ? ', ' : '') + t
    }
    //console.log('tags: ', str);
    return str;
  }

  trimText(str: string): string {
    return str.trim();
  }

  takePicture() : Promise<string> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      try {
        if(ctx.camera == null) {
            alert('Camera is not available');
            resolve(null);
        }
      }
      catch (err) {
        alert('Error occured while accessing camera: ' + JSON.stringify(err));
        reject(err);
      }

      const options: CameraOptions = {
        quality: 50,
        destinationType: ctx.camera.DestinationType.DATA_URL,
        encodingType: ctx.camera.EncodingType.JPEG,
        mediaType: ctx.camera.MediaType.PICTURE
      }

      //console.log('camera', ctx.camera);

      ctx.camera.getPicture(options).then((imageData) => {
         resolve(imageData)
        },
        (err) => {
          console.log(err);
          reject(err);
        });
      });
  }
}
