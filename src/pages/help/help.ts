import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
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
import { OneSignal } from '@ionic-native/onesignal';

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
  selectValue = "";
  email;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,public geolocation : Geolocation,
     public platform : Platform , public db : AngularFireDatabase,
     public load : LoadingController, public auth : AngularFireAuth,
     public toast : ToastController, public ac : ActionSheetController,
     public oneSignal: OneSignal) {

      
    platform.ready().then( ()=> {
      this.loadmymap();
    });
   
     auth.authState.subscribe(user => {
      if(user != undefined){
        this.email = user.email
        db.list("users",ref=>ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data =>{
         this.image = data[0]["image"];
         this.name = data[0]["name"];
 
        })
      }
     })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }


  presentActionSheet() {
    const actionSheet = this.ac.create({
      title: 'اختر المحافضة',
      cssClass:"dirion",
      buttons: [
        {text:"بغداد",handler:()=>{this.selectValue = "بغداد"}},
        {text:"أربيل",handler:()=>{this.selectValue = "أربيل"}},
        {text:"لأنبار",handler:()=>{this.selectValue = "لأنبار"}},
        {text:"بابل",handler:()=>{this.selectValue = "بابل"}},
        {text:"البصرة",handler:()=>{this.selectValue = "البصرة"}},
        {text:"حلبجة",handler:()=>{this.selectValue = "حلبجة"}},
        {text:"دهوك",handler:()=>{this.selectValue = "دهوك"}},
        {text:"القادسية",handler:()=>{this.selectValue = "القادسية"}},
        {text:"ديالى",handler:()=>{this.selectValue = "ديالى"}},
        {text:"ذي قار",handler:()=>{this.selectValue = "ذي قار"}},
        {text:"السليمانية",handler:()=>{this.selectValue = "السليمانية"}},
        {text:" صلاح الدين",handler:()=>{this.selectValue = " صلاح الدين"}},
        {text:"كركوك",handler:()=>{this.selectValue = "كركوك"}},
        {text:"كربلاء",handler:()=>{this.selectValue = "كربلاء"}},
        {text:"المثنى",handler:()=>{this.selectValue = "المثنى"}},
        {text:"بغداد",handler:()=>{this.selectValue = "بغداد"}},
        {text:"ميسان",handler:()=>{this.selectValue = "ميسان"}},
        {text:"النجف",handler:()=>{this.selectValue = "النجف"}},
        {text:"نينوى",handler:()=>{this.selectValue = "نينوى"}},
        {text:"واسط",handler:()=>{this.selectValue = "واسط"}},

      ]
    });
    actionSheet.present();
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

    var x = <HTMLMediaElement>document.getElementById("myAudio"); 

    
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
  x.play()
  
  $("input").val("");
  $("textarea").val("");
 var toast = this.toast.create({
  cssClass:"dirion",
  duration:3000,
   message:"تم نشر المشكلة"
 }).present();


 });

  }
  

  this.db.list("ids").valueChanges().subscribe( ids => {

    ids.forEach(id => {


     if(id['email'] != this.email){

      this.oneSignal.postNotification({
        app_id:"06cdfaf2-b067-4d85-a095-162869f76c6f",
        include_player_ids:[id['id']],
        contents: {
          en: "هناك شخص بحاجة الة مساعدة"
        },
        headings: {
          en: "مشكلة"
        }
      })

     }
     
    })

  })

  }




}