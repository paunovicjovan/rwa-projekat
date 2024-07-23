import { NgModule } from '@angular/core';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProfileDetailsComponent } from './components/user-profile-details/user-profile-details.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    UserProfileComponent,
    UserProfileDetailsComponent
  ],
  imports: [
    SharedModule
  ]
})
export class UsersModule { }
