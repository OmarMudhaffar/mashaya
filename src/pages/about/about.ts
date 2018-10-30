import { Component } from '@angular/core';
import { NavController, AlertController,Platform, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery'

declare var google;
import {
  GoogleMap,
  Marker,

} from '@ionic-native/google-maps';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  list:Observable<any>;
  map:GoogleMap;
  email;
  noproblem = true;
  nofr = false;

  constructor(public navCtrl: NavController, public auth : AngularFireAuth,
    public db : AngularFireDatabase,
    public alert : AlertController,
    public platform : Platform,
    public storeg : AngularFireStorage ,
    public load : LoadingController) {


 
      auth.authState.subscribe(user => {

        if(user != undefined){
          this.email = user.email;
          this.list = db.list("frhelp",ref => ref.orderByChild("email").equalTo(user.email)).snapshotChanges();
          db.list("frhelp",ref => ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data => {
            if(data[0] == undefined){
             this.noproblem = false;
             this.nofr = true;

            }
            if(data[0] != undefined){
             $("page-about .myspinner").hide();
             $("page-about .mcontent").css("padding","17px");

            }
          })
 
        }
      })

           
    platform.ready().then( ()=> {
      this.loadmap();
    });


  }

  ngOnInit(){
    var winh = $(window).height();
    var navh = $(".header").innerHeight();
    var tabmd = $(".tabs-md .tab-button").innerHeight();
    console.log(tabmd + " : " + navh);
  
    $("page-about .myspinner").height(winh - (navh+tabmd));

    
    }


  
    loadmap(){

     

      var i = 0;
      
      this.db.list("frhelp",ref => ref.orderByChild("email").equalTo(this.email)).valueChanges().subscribe(mdata => { 
  
        mdata.forEach(data => {
  
       var mymap = this.map = new GoogleMap(data['map'],{
          camera: {
            target: {
              lat: data['lat'],
              lng: data['lng']
            },
            zoom: 18,
            tilt: 30
          },
          controls: {
           compass:true,
           zoom:true,
           myLocationButton:true,
           myLocation:true,
           mapToolbar:true,
           indoorPicker:true,
          },
          gestures : {
            scroll:true,
            tilt:true,
            zoom:true,
            rotate:true
          }
          
        });
  
        mymap.addMarker({
          title: "مساعدة من صديق",
        icon: "red",
        animation: 'DROP',
        position: {
          lat: data['lat'],
          lng: data['lng']
        }
        }).then((marker: Marker) => {
  
        }).catch(err => {
          alert(err.message);
        });
  
        i = i++;
  
  
  
      });
  
    })
  
    
  
  
    }
  

  delete(key){
    this.alert.create({
      subTitle:"هل تريد حذف المساعدة؟",
      buttons:[
        {text:"حذف",handler : done => {
          this.db.list('frhelp').remove(key);
        }},"الغاء"
      ],
      cssClass:"dirion"
    }).present();
  }


}
