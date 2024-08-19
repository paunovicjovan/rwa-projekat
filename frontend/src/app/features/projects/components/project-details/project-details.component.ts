import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
import { ImageCroppedEvent } from 'ngx-image-cropper';
import * as tagsActions from '../../../tags/state/tags.actions';
import { ProjectStatus } from '../../enums/project-status.enum';
import * as usersActions from '../../../users/state/users.actions';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {

  @Input({required: true}) projectId!: number;
  @ViewChild("imageUploadControl", {static:false}) imageUploadControl!:ElementRef;
  dataFromStore$!: Observable<any>;
  imageChangedEvent: Event | null = null;
  croppedImage: Blob | null | undefined = null;

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
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser),
      canUserApply: this.store.select(projectsSelectors.selectCanUserApply)
    })
  }

  addTag(tag: Tag, projectId: number) {
    this.store.dispatch(tagsActions.addTagToProject({ tagId:tag.id, projectId }));
  }

  removeTag(tagId: number, projectId: number) {
    this.store.dispatch(tagsActions.removeTagFromProject({ tagId, projectId }));
  }

  deleteProject(projectId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da obrišete ovaj projekat?",
      actionToDispatch: projectsActions.deleteProject({ projectId })
    }));
  }

  selectedImageChanged(event: Event) {
    this.imageChangedEvent = event;
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  cancelImageChange() {
    this.imageChangedEvent = null;
    this.imageUploadControl.nativeElement.value = null;
  }

  submitImageChange(projectId: number) {
    if(!this.croppedImage) 
      return;

    const croppedImageFile = new File([this.croppedImage], 'profile-image.png', { type: 'image/png' });
    this.store.dispatch(projectsActions.changeProjectImage({ projectId, image: croppedImageFile }))
  }

  disableApplications(projectId: number) {
    const updateProjectDto: UpdateProjectDto = {
      id: projectId,
      status: ProjectStatus.CLOSED
    }
    this.store.dispatch(projectsActions.updateProject({updateProjectDto}));
  }

  enableApplications(projectId: number) {
    const updateProjectDto: UpdateProjectDto = {
      id: projectId,
      status: ProjectStatus.OPENED
    }
    this.store.dispatch(projectsActions.updateProject({updateProjectDto}));
  }

  finishProject(project:Project) {
    this.openProjectUpdateDialog({
      ...project,
      status: ProjectStatus.COMPLETED
    });
  }

  openProjectUpdateDialog(project: Project) {
    const dialogData: UpdateProjectDto = {
      ...project
    }
    this.store.dispatch(projectsActions.openProjectDialog({dialogData}))
  }

  applyForProject(projectId: number) {
    this.store.dispatch(usersActions.applyForProject({projectId}));
  }

  unenrollFromProject(projectId: number, userId: number) {
    this.store.dispatch(usersActions.unenrollUserFromProject({projectId, userId}));
  }

}
