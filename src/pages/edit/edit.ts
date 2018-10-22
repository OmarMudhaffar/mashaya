import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;
import {
  GoogleMap,
  GoogleMapsEvent,
  Marker
} from '@ionic-native/google-maps';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as $ from 'jquery'

/**
 * Generated class for the EditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {

  mymaps : GoogleMap;
  lat;
  lng;
  key;
  problemv;
  desv;
  mohafadav;
  phonev;
  addrv;
 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,public geolocation : Geolocation,
     public platform : Platform , public db : AngularFireDatabase,
     public load : LoadingController, public auth : AngularFireAuth,
     public toast : ToastController) {

      platform.ready().then( ()=> {
        this.loadmymap();
      });

      this.problemv = navParams.get("problem");
      this.desv = navParams.get("des");
      this.mohafadav = navParams.get("mohafada");
      this.phonev = navParams.get("phone");
      this.addrv = navParams.get("addr");
      this.key = navParams.get("key");


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }


  
  loadmymap(){
    

    this.geolocation.getCurrentPosition().then( pos => {
 
 
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;

     var map = this.mymaps = new GoogleMap("mymaps",{
       camera: {
         target: {
           lat: pos.coords.latitude,
           lng: pos.coords.longitude
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
      title: "مشكلة",
      icon: 'green',
      animation: 'DROP',
      position: {
        lat:pos.coords.latitude,
        lng:pos.coords.longitude
      },
      }).then((marker: Marker) => {

      }).catch(err => {
        alert(err.message);
      })

    })

  }


  edit(problem,place,description,phone,mohafada){

  if(problem.length > 1 && place.length > 1 && description.length > 10 && phone.length >= 10 && mohafada.length >1 ){
   
    var d = new Date();

const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];


this.db.list("problems").update(this.key,{
  problem:problem,
  des:description,
  addr:place,
  lat:this.lat,
  lng:this.lng,
  date: d.getFullYear() + "/" + d.getDate() + "/" + monthNames[d.getMonth()],
  phone:phone,
  mohafada:mohafada,
  markname:problem,
 }).then( ()=> {
  $("input").val("");
  $("textarea").val("");
  this.navCtrl.pop();
 var toast = this.toast.create({
  cssClass:"dirion",
  duration:3000,
   message:"تم نشر المشكلة"
 }).present();
 });

  }
  
  }

}