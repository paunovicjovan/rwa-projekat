import { Component, Input } from '@angular/core';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as projectsActions from '../../state/projects.actions';
import * as projectsSelectors from '../../state/projects.selectors';
import * as tagsSelectors from '../../../tags/state/tags.selectors';
import * as authSelectors from '../../../auth/state/auth.selectors';
import { combineLatest, Observable } from 'rxjs';
import { Tag } from '../../../tags/models/tag.interface';
import { UpdateProjectDto } from '../../models/update-project-dto.interface';
import { Project } from '../../models/project.interface';
import * as sharedActions from '../../../../shared/state/shared.actions';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {

  @Input({required: true}) projectId!: number;
  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadProject();
    this.selectDataFromStore();
  }
  
  loadProject() {
    this.store.dispatch(projectsActions.loadProject({projectId: this.projectId}));
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(projectsSelectors.selectIsLoading),
      chosenProject: this.store.select(projectsSelectors.selectChosenProject),
      tags: this.store.select(tagsSelectors.selectLoadedTags),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser)
    })
  }

  addTag(tag: Tag) {

  }

  removeTag(tagId: number) {
    
  }

  openProjectUpdateDialog(project: Project) {
    const dialogData: UpdateProjectDto = {
      ...project
    }
    this.store.dispatch(projectsActions.openProjectDialog({dialogData}))
  }

  deleteProject(projectId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da obrišete ovaj projekat?",
      actionToDispatch: projectsActions.deleteProject({ projectId })
    }));
  }
}
