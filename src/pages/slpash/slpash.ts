import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from '@angular/fire/auth';
import { TabsPage } from '../tabs/tabs';
import * as $ from 'jquery'

/**
 * Generated class for the SlpashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slpash',
  templateUrl: 'slpash.html',
})
export class SlpashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth : AngularFireAuth) {

    auth.authState.subscribe(user => {
      if(user != undefined){
     
        if(user.emailVerified){
          navCtrl.setRoot(TabsPage);
          navCtrl.goToRoot;
        }

      if(!user.emailVerified){
        navCtrl.setRoot(RegisterPage);
        navCtrl.goToRoot;
      }
      }
      if(user == undefined){
        navCtrl.setRoot(RegisterPage);
        navCtrl.goToRoot;
      }
    })


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlpashPage');
  }

  ngOnInit(){
    var winh = $(window).height();

  
    $(".myspinner").height(winh);

    
    }


}
