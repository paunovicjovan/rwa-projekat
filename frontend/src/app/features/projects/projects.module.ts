import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { TagsModule } from "../tags/tags.module";

@NgModule({
  declarations: [
    ProjectsPageComponent,
    NewProjectComponent
  ],
  imports: [
    SharedModule,
    TagsModule
]
})
export class ProjectsModule { }
