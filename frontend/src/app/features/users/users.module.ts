import { NgModule } from '@angular/core';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { UserProfileDetailsComponent } from './components/user-profile-details/user-profile-details.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Features } from '../features.enum';
import { usersReducer } from './state/users.reducer';
import * as usersEffects from './state/users.effects';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { UsersSearchFiltersComponent } from './components/users-search-filters/users-search-filters.component';
import { UserPreviewComponent } from './components/user-preview/user-preview.component';



@NgModule({
  declarations: [
    UserProfilePageComponent,
    UserProfileDetailsComponent,
    UsersPageComponent,
    UsersSearchFiltersComponent,
    UserPreviewComponent,
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature(Features.Users, usersReducer),
    EffectsModule.forFeature(usersEffects)
  ]
})
export class UsersModule { }
