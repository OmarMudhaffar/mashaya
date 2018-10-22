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
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  mymaps : GoogleMap;
  lat;
  lng;
  image;
  name;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,public geolocation : Geolocation,
     public platform : Platform , public db : AngularFireDatabase,
     public load : LoadingController, public auth : AngularFireAuth,
     public toast : ToastController) {

       
    
 
    platform.ready().then( ()=> {
      this.loadmymap();
    });
   
     auth.authState.subscribe(user => {
       db.list("users",ref=>ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data =>{
        this.image = data[0]["image"];
        this.name = data[0]["name"];

       })
     })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
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


  add(problem,place,description,phone,mohafada){

  if(problem.length > 1 && place.length > 1 && description.length > 10 && phone.length >= 10 && mohafada.length >1 ){
    var char = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
    var rand1 = Math.floor(Math.random() * char.length);
    var rand2 = Math.floor(Math.random() * char.length);
    var rand3 = Math.floor(Math.random() * char.length);
    var rand4 = Math.floor(Math.random() * char.length);
    var rand5 = Math.floor(Math.random() * char.length);
    var rand = char[rand1] + char[rand2] + char[rand3] + char[rand4] + char[rand5];


    var d = new Date();

const monthNames = ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];


this.db.list("problems").push({
  problem:problem,
  des:description,
  addr:place,
  email:this.auth.auth.currentUser.email,
  lat:this.lat,
  lng:this.lng,
  map:rand,
  name:this.name,
  date: d.getFullYear() + "/" + d.getDate() + "/" + monthNames[d.getMonth()],
  map2:rand + "s",
  phone:phone,
  mohafada:mohafada,
  markname:problem,
  image:this.image,
 }).then( ()=> {
  $("input").val("");
  $("textarea").val("");
 var toast = this.toast.create({
  cssClass:"dirion",
  duration:3000,
   message:"تم نشر المشكلة"
 }).present();
 });

  }
  
  }

}