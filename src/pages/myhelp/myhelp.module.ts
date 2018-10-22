import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyhelpPage } from './myhelp';

@NgModule({
  declarations: [
    MyhelpPage,
  ],
  imports: [
    IonicPageModule.forChild(MyhelpPage),
  ],
})
export class MyhelpPageModule {}
