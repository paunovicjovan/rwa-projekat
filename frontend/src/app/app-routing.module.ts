import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { HomeComponent } from './core/components/home/home.component';
import { UserProfilePageComponent } from './features/users/components/user-profile-page/user-profile-page.component';
import { UsersPageComponent } from './features/users/components/users-page/users-page.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }, 
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'users',
    children: [
      {
        path: '',
        component: UsersPageComponent
      },
      {
        path: ':username',
        component: UserProfilePageComponent
      }
    ],
    canActivate: [authGuard]
  },
  // {
  //   path: 'user-profile/:username',
  //   component: UserProfilePageComponent,
  //   canActivate: [authGuard]
  // },
  // {
  //   path: 'search-users',
  //   component: UsersPageComponent,
  //   canActivate: [authGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
