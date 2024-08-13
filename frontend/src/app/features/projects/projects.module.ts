import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { TagsModule } from "../tags/tags.module";
import { EffectsModule } from '@ngrx/effects';
import * as projectsEffects from '../projects/state/projects.effects';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features.enum';
import { projectsReducer } from './state/projects.reducer';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectPreviewComponent } from './components/project-preview/project-preview.component';
import { ProjectOverviewPageComponent } from './components/project-overview-page/project-overview-page.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { ProjectParticipantsComponent } from './components/project-participants/project-participants.component';

@NgModule({
  declarations: [
    ProjectsPageComponent,
    NewProjectComponent,
    ProjectsListComponent,
    ProjectPreviewComponent,
    ProjectOverviewPageComponent,
    ProjectDetailsComponent,
    ProjectParticipantsComponent
  ],
  imports: [
    SharedModule,
    TagsModule,
    EffectsModule.forFeature(projectsEffects),
    StoreModule.forFeature(Features.Projects, projectsReducer)
]
})
export class ProjectsModule { }
