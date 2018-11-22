import { Component } from '@angular/core';
import { NavController, AlertController,Platform, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { CallNumber } from '@ionic-native/call-number';
import * as $ from 'jquery'
import { OneSignal } from '@ionic-native/onesignal';

import {
  GoogleMap,
  Marker,

} from '@ionic-native/google-maps';
import { MyhelpPage } from '../myhelp/myhelp';
import { AccountPage } from '../account/account';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public Fbref : any;
  list:Observable<any>;
  map:GoogleMap;
  image = "https://firebasestorage.googleapis.com/v0/b/raeak-iq.appspot.com/o/man.png?alt=media&token=cc38bf2e-5ea3-4210-bafe-25dcf3674013";
  id;
  mySelectedPhoto;
  loading;
  currentPhoto ;
  imgSource;
  noproblem = true;

  constructor(public navCtrl: NavController, public auth : AngularFireAuth,
    public db : AngularFireDatabase,
    public alert : AlertController,
    public platform : Platform,
    private camera:Camera,
    public storeg : AngularFireStorage ,
    public load : LoadingController,public call : CallNumber,
    public oneSignal: OneSignal) {

      
 
    platform.ready().then( ()=> {
      this.loadmap();
    });

      auth.authState.subscribe(user => {

        if(user != undefined){
          this.list = db.list("problems").valueChanges();
          db.list("problems").valueChanges().subscribe(data => {
            if(data[0] == undefined){
             this.noproblem = false;
            }
            if(data[0] != undefined){
             $("page-home .myspinner").hide();
            }
          })
          db.list("users",ref=>ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data => {
            this.image = data[0]['image'];
            this.id = data[0]['id'];
          })
        }
      })

      this.mynote();

      this.checkNote();

    }

    
  ngOnInit(){
    var winh = $(window).height();
    var navh = $(".header").innerHeight();
    var tabmd = $(".tabs-md .tab-button").innerHeight();
    console.log(tabmd);
  
    $(".myspinner").height(winh - (navh+tabmd));

    }


    mynote(){
      this.oneSignal.startInit('06cdfaf2-b067-4d85-a095-162869f76c6f', '216519128906');
  
  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
  
  
  this.oneSignal.endInit();
    }

    checkNote(){
      this.oneSignal.getIds().then( id => {
        this.db.list("ids",ref => ref.orderByChild("id").equalTo(id.userId)).valueChanges().subscribe( mdata => {
         if(mdata[0] == undefined){
           this.db.list("ids").push({
             id:id.userId,
             email:this.auth.auth.currentUser.email
           })
         }
        });
        });
    }

    loadmap(){

     

      var i = 0;
      
      this.db.list("problems").valueChanges().subscribe(mdata => { 
  
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
  
        i = i++;
  
  
  
      });
  
    })
  
    
  
  
    }
  


    logout(){

      this.alert.create({
        cssClass:"dirion",
        subTitle:"هل تريد الخروح?",
        buttons:[{text:"خروج",handler: ()=> {
        this.auth.auth.signOut();
        } },"الغاء"]
      }).present();

    }
    

    takePhoto(){
      const options: CameraOptions = {
        targetHeight:200,
        targetWidth:200,
        destinationType : this.camera.DestinationType.DATA_URL,
        encodingType:this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
      }
      
      this.camera.getPicture(options).then((imageData) =>{
        this.loading = this.load.create({
          content: "جاري تبديل الصورة "
           });
    this.loading.present();
      this.mySelectedPhoto = this.dataURLtoBlob('data:image/jpeg;base64,'+imageData);
          this.upload();
              
              },(err)=>{
          console.log(err);
              });
      
      
      }
      
          
          
      dataURLtoBlob(myURL){
          let binary = atob(myURL.split(',')[1]);
      let array = [];
      for (let i = 0 ; i < binary.length;i++){
          array.push(binary.charCodeAt(i));
      }
          return new Blob([new Uint8Array(array)],{type:'image/jpeg'});
      }    
          
          
      upload(){
      if(this.mySelectedPhoto){
          var uploadTask = firebase.storage().ref().child('images/'+this.auth.auth.currentUser.email+".jpg");
          var put = uploadTask.put(this.mySelectedPhoto);
          put.then(this.onSuccess,this.onErrors);
    
          var sub = this.db.list("users",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(data => {
    
            uploadTask.getDownloadURL().then(url =>{
              
              
              this.db.list("users").update(data[0].payload.key,{
                image:url
              }).then( ()=> {
                
                
     
                var cont = this.db.list("problems",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(vdata => {
    
                  vdata.forEach(vimgs => {
    
                    this.db.list("problems").update(vimgs.key,{
                      image:url,
                    }).then( ()=> {
                      
                      cont.unsubscribe()
                    
                      var cont2 = this.db.list("friends/" + this.id, ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(frdata => {
                        frdata.forEach(frdatas => {
                          this.db.list("friends/" + this.id).update(frdatas.key,{
                            image:url
                          }).then( ()=> {
                            cont2.unsubscribe();
                          })
                        })
                      })


                    })
    
                  });
    
                });
    
              })
    
          
              
            });
    
    
          });
          
          
      }
      }    
          
      onSuccess=(snapshot)=>{
          this.currentPhoto = snapshot.downloadURL;
    
          this.loading.dismiss();

      } 
          
      onErrors=(error)=>{
    
          this.loading.dismiss();
    
    
      }   
          
      getMyURL(){
          firebase.storage().ref().child('images/'+this.auth.auth.currentUser.email+".jpg").getDownloadURL().then((url)=>{
              this.imgSource = url;
              
              })
      }
          
          
          
          
      phone(number){
         this.call.callNumber(number,true)
       }

       warm(){
         this.navCtrl.setRoot(MyhelpPage);
         this.navCtrl.goToRoot;
       }

       view(name,image,date,problem,des,mohafada,addr,lat,lng,map){
         this.navCtrl.setRoot(AccountPage,{
           name:name,
           image:image,
           date:date,
           problem:problem,
           des:des,
           mohafada:mohafada,
           addr:addr,
           lat:lat,
           lng:lng,
           map:map
         });
         this.navCtrl.goToRoot;
       }


}