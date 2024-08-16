import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { HomeComponent } from './core/components/home/home.component';
import { UserProfilePageComponent } from './features/users/components/user-profile-page/user-profile-page.component';
import { UsersPageComponent } from './features/users/components/users-page/users-page.component';
import { authGuard } from './core/guards/auth.guard';
import { ProjectsPageComponent } from './features/projects/components/projects-page/projects-page.component';
import { NewProjectComponent } from './features/projects/components/new-project/new-project.component';
import { ProjectOverviewPageComponent } from './features/projects/components/project-overview-page/project-overview-page.component';
import { UserProjectsPageComponent } from './features/projects/components/user-projects-page/user-projects-page.component';

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
  {
    path: 'projects',
    children: [
      {
        path: '',
        component: ProjectsPageComponent
      },
      {
        path: 'new-project',
        component: NewProjectComponent
      }, 
      {
        path: ':id',
        component: ProjectOverviewPageComponent
      }
    ],
    canActivate: [authGuard]
  },
  {
    path: 'user-projects/:username',
    component: UserProjectsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
