import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Camera } from '@ionic-native/camera';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { CallNumber } from '@ionic-native/call-number';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { RegisterPage } from '../pages/register/register';
import { InfoPage } from '../pages/info/info';
import { HelpPage } from '../pages/help/help';
import { AccountPage } from '../pages/account/account';
import { MyhelpPage } from '../pages/myhelp/myhelp';
import { EditPage } from '../pages/edit/edit';
import { ReversePipe } from '../pipes/reverse/reverse';
import { SlpashPage } from '../pages/slpash/slpash';
import { OneSignal } from '@ionic-native/onesignal';

import { Facebook } from '@ionic-native/facebook';

import { GooglePlus } from '@ionic-native/google-plus';

import { HTTP } from '@ionic-native/http';

var config = {
  apiKey: "AIzaSyBTs8kR3ggtyWb3lyrOpLd6k_08tli61oU",
  authDomain: "mashayaiq.firebaseapp.com",
  databaseURL: "https://mashayaiq.firebaseio.com",
  projectId: "mashayaiq",
  storageBucket: "mashayaiq.appspot.com",
  messagingSenderId: "216519128906"
};


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    RegisterPage,
    InfoPage,
    HelpPage,
    AccountPage,
    MyhelpPage,
    EditPage,
    SlpashPage,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    RegisterPage,
    InfoPage,
    SlpashPage,
    HelpPage,
    AccountPage,
    MyhelpPage,
    EditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    OneSignal,
    Geolocation,
    Facebook,
    CallNumber,
    GooglePlus,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
