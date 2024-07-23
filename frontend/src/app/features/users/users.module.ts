import { NgModule } from '@angular/core';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserProfileDetailsComponent } from './components/user-profile-details/user-profile-details.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Features } from '../features.enum';
import { usersReducer } from './state/users.reducer';
import * as usersEffects from './state/users.effects'



@NgModule({
  declarations: [
    UserProfileComponent,
    UserProfileDetailsComponent
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature(Features.Users, usersReducer),
    EffectsModule.forFeature(usersEffects)
  ]
})
export class UsersModule { }
