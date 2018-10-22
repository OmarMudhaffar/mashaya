import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public auth : AngularFireAuth) {
    platform.ready().then(() => {
      

      auth.authState.subscribe(user => {
        if(user != undefined){
        if(user.emailVerified){
          this.rootPage = TabsPage;
        }
        if(!user.emailVerified){
          this.rootPage = RegisterPage;

        }
        }
        if(user == undefined){
          this.rootPage = RegisterPage;
        }
      })

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}