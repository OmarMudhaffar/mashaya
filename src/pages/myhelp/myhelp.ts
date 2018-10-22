import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
declare var google;
import * as $ from 'jquery'

import {
  GoogleMap,
  Marker
} from '@ionic-native/google-maps';
import { EditPage } from '../edit/edit';
import { HomePage } from '../home/home';

/**
 * Generated class for the MyhelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myhelp',
  templateUrl: 'myhelp.html',
})
export class MyhelpPage {

  list : Observable<any>
  noproblem = true;
  map:GoogleMap;

  email;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db : AngularFireDatabase,public auth : AngularFireAuth,
    public platform : Platform,public alert : AlertController) {

      platform.ready().then( ()=> {
        this.loadmap();
      });

      auth.authState.subscribe(user => {
        if(user != undefined){
          this.email = user.email;
          this.list = db.list("problems",ref => ref.orderByChild("email").equalTo(user.email)).snapshotChanges();
     

          db.list("problems",ref =>  ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data => {
            if(data[0] == undefined){
             this.noproblem = false;
            }
            if(data[0] != undefined){
             $(".myspinner").remove();
            }
          })

        }
      })

  }


  ngOnInit(){
    var winh = $(window).height();
    var navh = $(".header").innerHeight();
    var tabmd = $(".tabs-md .tab-button").innerHeight();
    console.log(tabmd);
  
    $(".myspinner").height(winh - (navh+tabmd));
  
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyhelpPage');
  }

  loadmap(){
    
    this.db.list("problems",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).valueChanges().subscribe(mdata => { 

      mdata.forEach(data => {

     var mymap = this.map = new GoogleMap(data['map2'],{
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
        title: data['markname'],
      icon: data['color'],
      animation: 'DROP',
      position: {
        lat: data['lat'],
        lng: data['lng']
      }
      }).then((marker: Marker) => {

      }).catch(err => {
        alert(err.message);
      });



    });

  })

  

  }



  delete(key){
    this.alert.create({
      subTitle:"هل تريد حذف الابلاغ؟",
      cssClass:"dirion",
      buttons:[
        {text:"حذف",handler:done=>{
          this.db.list("problems").remove(key);
        }},
        "الغاء"
      ]
    }).present();
  }


  edit(problem,des,mohafada,phone,addr,key){

    this.navCtrl.push(EditPage,{
      problem:problem,
      des:des,
      mohafada:mohafada,
      phone:phone,
      addr:addr,
      key:key
    })

  }

  showhome(){
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.goToRoot;
  }

}