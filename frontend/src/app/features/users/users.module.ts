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
import { ReviewsModule } from '../reviews/reviews.module';
import { TagsModule } from "../tags/tags.module";
import { UserViewerComponent } from './components/user-viewer/user-viewer.component';
import { RoleChangeDialogComponent } from './components/role-change-dialog/role-change-dialog.component';
import { PersonalityTestPageComponent } from './components/personality-test-page/personality-test-page.component';



@NgModule({
  declarations: [
    UserProfilePageComponent,
    UserProfileDetailsComponent,
    UsersPageComponent,
    UsersSearchFiltersComponent,
    UserPreviewComponent,
    UserViewerComponent,
    RoleChangeDialogComponent,
    PersonalityTestPageComponent
  ],
  imports: [
    SharedModule,
    ReviewsModule,
    StoreModule.forFeature(Features.Users, usersReducer),
    EffectsModule.forFeature(usersEffects),
    TagsModule
  ],
  exports: [
    UserPreviewComponent,
    UserViewerComponent
  ]
})
export class UsersModule { }
