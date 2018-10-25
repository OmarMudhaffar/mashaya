import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';


declare var google;
import {
  GoogleMap,
  Marker,

} from '@ionic-native/google-maps';
import { HomePage } from '../home/home';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  name;
  image;
  date;
  problem;
  des;
  mohafada;
  addr;
  lat;
  lng;
  imap;
  map : GoogleMap;
  color;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public db : AngularFireDatabase,public auth : AngularFireAuth,
     public platform : Platform) {
      
      this.name = navParams.get("name");
      this.image = navParams.get("image");
      this.date = navParams.get("date");
      this.problem = navParams.get("problem");
      this.des = navParams.get("des");
      this.mohafada = navParams.get("mohafada");
      this.addr = navParams.get("addr");
      this.lat = navParams.get("lat");
      this.lng = navParams.get("lng");
      this.imap = navParams.get("map");
  
      console.log(navParams.get("map"))
 
      platform.ready().then( ()=> {
        this.loadmymap();
      });
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  
loadmymap(){
    


  var map = this.map = new GoogleMap(this.imap,{
    camera: {
      target: {
        lat: this.lat,
        lng: this.lng
      },
      zoom: 18,
      tilt: 30
    },
    controls: {
     zoom:true,
     myLocationButton:true,
     myLocation:true,
    },
    gestures : {
      scroll:true,
      tilt:true,
      zoom:true,
      rotate:true
    }
    
  });

  map.addMarker({
   title: this.problem,
 icon: this.color,
 animation: 'DROP',
 position: {
   lat: this.lat,
   lng: this.lng
 }
 }).then((marker: Marker) => {

 }).catch(err => {
   alert(err.message);
 });


}


showhome(){
  this.navCtrl.setRoot(HomePage);
  this.navCtrl.goToRoot;
}


}