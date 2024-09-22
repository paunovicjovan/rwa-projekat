import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { HomeComponent } from './core/components/home/home.component';
import { UserProfilePageComponent } from './features/users/components/user-profile-page/user-profile-page.component';
import { UsersPageComponent } from './features/users/components/users-page/users-page.component';
import { authGuard } from './core/guards/auth-guard/auth.guard';
import { ProjectsPageComponent } from './features/projects/components/projects-page/projects-page.component';
import { NewProjectComponent } from './features/projects/components/new-project/new-project.component';
import { ProjectOverviewPageComponent } from './features/projects/components/project-overview-page/project-overview-page.component';
import { UserProjectsPageComponent } from './features/projects/components/user-projects-page/user-projects-page.component';
import { ManageTagsPageComponent } from './features/tags/components/manage-tags-page/manage-tags-page.component';
import { adminOrModeratorGuard } from './core/guards/admin-or-moderator-guard/admin-or-moderator.guard';
import { ChatsPageComponent } from './features/chat/components/chats-page/chats-page.component';
import { PersonalityTestPageComponent } from './features/users/components/personality-test-page/personality-test-page.component';
import { ExploreUsersPageComponent } from './features/users/components/explore-users-page/explore-users-page.component';
import { ReceivedInvitationsPageComponent } from './features/projects/components/received-invitations-page/received-invitations-page.component';

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
    path: 'explore-users',
    component: ExploreUsersPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'personality-test',
    component: PersonalityTestPageComponent,
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
    component: UserProjectsPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'manage-tags',
    component: ManageTagsPageComponent,
    canActivate: [authGuard, adminOrModeratorGuard]
  },
  {
    path: 'chats',
    component: ChatsPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'invitations',
    component: ReceivedInvitationsPageComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
