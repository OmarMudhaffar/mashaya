import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { AngularFireAuth } from '@angular/fire/auth';
import { SlpashPage } from '../pages/slpash/slpash';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SlpashPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public auth : AngularFireAuth) {
    platform.ready().then(() => {
     
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}