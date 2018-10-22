import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import * as $ from 'jquery'
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  show =false;
  friends:Observable<any>;
  name;
  image;
  users:Observable<any>;
  email;
  id;
  nofr = true;
  nofrs = false;


  constructor(public navCtrl: NavController,
    public db : AngularFireDatabase, public auth : AngularFireAuth,
    public geolocation : Geolocation, public alert : AlertController,
    public load : LoadingController,public toast : ToastController) {
 
      auth.authState.subscribe(user => {
        if(user != undefined){

         db.list("users",ref => ref.orderByChild("email").equalTo(user.email)).valueChanges().subscribe(data => {
          this.id = data[0]['id'];
          this.name = data[0]['name'];
          this.image = data[0]['image'];
          this.friends = db.list("friends/"+data[0]['id']).valueChanges();
          db.list("friends/"+data[0]['id']).valueChanges().subscribe(data => {
          
            if(data[0] != undefined){
              this.nofr = false;
              $(".myspinner").hide();
            }

            if(data[0] == undefined){
              $("#loadsp").hide();
              
              $(".noproblem").show();
            
            }
  
            })
          })

          this.users = db.list("users").valueChanges();


          this.email = user.email;
          
        }
      })


  }

  ionViewDidLoad(){

  }


  sefr(){
    $(".myfriends").hide();
    $(".addfriend").show();
    $(".myspinner").hide();
  }

  hefr(){

    this.db.list("friends").valueChanges().subscribe(data => {
          
      if(data[0] == undefined){
        $(".myspinner").show();
      }

      })

    $(".addfriend").hide();
    $(".myfriends").show();
  }


  ngOnInit(){

    var winh = $(window).height();
    var navh = $(".header").innerHeight();
    var tabmd = $(".tabs-md .tab-button").innerHeight();
    console.log(tabmd);
  
    $(".myspinner").height(winh - (navh+tabmd));

    $(".msearch input").keyup(done => {

      var text : any = $(".msearch input").val();

      this.users = this.db.list("users",ref => ref.orderByChild("name").equalTo(text)).valueChanges()
    })

  $("#search").click(function(){
    $(".msearch input").animate({
      padding:"5px",
      width:"100%"
    },100,function(){
      $("#search").hide();
      $("#close").show();
    })
  })


  $("#close").click(done =>{

    $(".msearch input").animate({
      padding:"0",
      width:"0"
    },100,function(){
      $("#close").hide();
      $("#search").show();
    })
  })


  }


  sendHelp(useremail,name){


    this.geolocation.getCurrentPosition().then( pos => {

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
    

      this.alert.create({
        subTitle:"هل تريد المساعدة؟",
        message:"سيتم ارسال طلب الى " + name + " بأنك تحاول مساعدته للوصول اليك",
        cssClass:"dirion",
        buttons:[
        {text:"ارسال",handler : send => {
        this.db.list("frhelp").push({
        from:this.email,
        image:this.image,
        name:this.name,
        email:useremail,
        date: d.getFullYear() + "/" + d.getDate() + "/" + monthNames[d.getMonth()],
        map:rand,
        lat:pos.coords.latitude,
        lng:pos.coords.longitude,
        }).then( ()=> {
          this.toast.create({
            message:"تم ارسال طلب المساعدة",
            duration:3000,
            cssClass:"dirion"
          }).present();
        })
        }},
        "الغاء"
        ]
      }).present()

    });

  }

  addfriend(email,name,image,id){

 
    var load = this.load.create({
      content:"جاري اضافة الصديق",
      cssClass:"dirion"
    });


    this.alert.create({
      subTitle:"اضافة صديق",
      message:"هل تريد اضافة " + name + " كصديق؟",
      cssClass:"dirion",
      buttons:[
      {text:"اضافة",handler : send => {

        load.present();


var sub = this.db.list("friends/" + this.id,ref=>ref.orderByChild("fremail").equalTo(email)).valueChanges().subscribe(data => {


if(data[0] == undefined){
sub.unsubscribe();
load.dismiss();
this.db.list("friends/" + this.id).push({
email:this.auth.auth.currentUser.email,
fremail:email,
image:image,
name:name
}).then( () => {
this.toast.create({
  message:"تم اضافة الصديق",
  duration:3000,
  cssClass:"dirion"
}).present();


$(".msearch input").animate({
  padding:"0",
  width:"0"
},100,function(){
  $("#close").hide();
  $("#search").show();

  $(".addfriend").hide();
  $(".myfriends").show();

})

})
}else{
load.dismiss();
this.alert.create({
subTitle:"انه صديقك بلفعل",
cssClass:"dirion",
buttons:["حسنا"]
}).present()
}




})

      
      }},
      "الغاء"
      ]
    }).present();
    

  }

}