import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features.enum';
import { authReducer } from './state/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import * as authEffects from './state/auth.effects';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature(Features.Auth, authReducer),
    EffectsModule.forFeature(authEffects)
  ]
})
export class AuthModule { }
