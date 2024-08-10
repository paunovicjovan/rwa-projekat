import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { TagsModule } from "../tags/tags.module";
import { EffectsModule } from '@ngrx/effects';
import * as projectsEffects from '../projects/state/projects.effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    ProjectsPageComponent,
    NewProjectComponent
  ],
  imports: [
    SharedModule,
    TagsModule,
    EffectsModule.forFeature(projectsEffects),
    // StoreModule
]
})
export class ProjectsModule { }
