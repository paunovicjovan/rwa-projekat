import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import * as usersActions from '../../../users/state/users.actions';
import * as usersSelectors from '../../../users/state/users.selectors';
import * as sharedActions from '../../../../shared/state/shared.actions';
import { combineLatest, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ParticipantStatus } from '../../models/participant-status.enum';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../users/models/user.interface';

@Component({
  selector: 'app-project-participants',
  templateUrl: './project-participants.component.html',
  styleUrl: './project-participants.component.scss'
})
export class ProjectParticipantsComponent implements OnInit {

  @Input({required: true}) projectId!: number;
  dataFromStore$!: Observable<any>;
  selectedParticipantsView!: ParticipantStatus;
  usersForm!: FormGroup;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeUsersForm();
    this.loadAcceptedUsersForProject(1, 10);
    this.selectDataFromStore();
  }

  initializeUsersForm() {
    this.usersForm = this.formBuilder.group({
      users: this.formBuilder.array([], [Validators.required])
    });
  }

  onTabChange(event: any) {
    switch (event.index) {
      case 0:
        this.loadAcceptedUsersForProject(1, 10);
        break;
      case 1:
        this.loadAppliedUsersForProject(1, 10);
        break;
      case 2:
        this.loadSuggestedCollaboratorsForProject();
        break;
      case 3:
        this.loadInvitedUsersForProject(1, 10);
        break;
    }
  }

  onPaginateChange(pageEvent: PageEvent) {
    switch (this.selectedParticipantsView) {
      case ParticipantStatus.Applied:
        this.loadAppliedUsersForProject(pageEvent.pageIndex + 1, pageEvent.pageSize);
        break;
      case ParticipantStatus.Accepted:
        this.loadAcceptedUsersForProject(pageEvent.pageIndex + 1, pageEvent.pageSize);
        break;
      case ParticipantStatus.Invited:
        this.loadInvitedUsersForProject(pageEvent.pageIndex + 1, pageEvent.pageSize);
        break;
    }
  }

  loadAppliedUsersForProject(page: number, limit: number) {
    this.selectedParticipantsView = ParticipantStatus.Applied;
    this.store.dispatch(usersActions.loadAppliedUsersForProject({ projectId: this.projectId, paginationOptions: { page, limit }}));
  }
  
  loadAcceptedUsersForProject(page: number, limit: number) {
    this.selectedParticipantsView = ParticipantStatus.Accepted;
    this.store.dispatch(usersActions.loadAcceptedUsersForProject({ projectId: this.projectId, paginationOptions: { page, limit }}));
  }

  loadSuggestedCollaboratorsForProject() {
    this.selectedParticipantsView = ParticipantStatus.Suggested;
    this.store.dispatch(usersActions.loadSuggestedCollaborators({ projectId: this.projectId }));
  }

  loadInvitedUsersForProject(page: number, limit: number) {
    this.selectedParticipantsView = ParticipantStatus.Invited;
    this.store.dispatch(usersActions.loadInvitedUsersForProject({ projectId: this.projectId, paginationOptions: { page, limit }}));
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(usersSelectors.selectIsLoading),
      users: this.store.select(usersSelectors.selectUsers),
      paginationMetadata: this.store.select(usersSelectors.selectUsersPaginationMetadata)
    })
  }

  acceptUserInProject(userId: number) {
    this.store.dispatch(usersActions.acceptUserInProject({userId, projectId: this.projectId}));
  }

  unenrollUserFromProject(userId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da uklonite korisnika sa projekta?",
      actionToDispatch: usersActions.unenrollUserFromProject({userId, projectId: this.projectId})
    }));
  }

  addUserToForm(user: User) {
    if(this.findUserIndexInForm(user.id) >= 0)
      return;

    const newUserFormControl = new FormControl({...user});
    this.formUsers.push(newUserFormControl);
  }

  removeUserFromForm(user: User) {
    const userIndex = this.findUserIndexInForm(user.id);
    this.formUsers.removeAt(userIndex);
  }

  findUserIndexInForm(userId: number): number {
    const userIndex = this.formUsers.value.findIndex((user: User) => user.id === userId);
    return userIndex;
  }

  inviteUsersToProject() {
    this.formUsers.value.forEach((user: User) => {
      this.inviteUserToProject(user.id);
    });
  }

  inviteUserToProject(userId: number) {
    this.store.dispatch(usersActions.inviteUserToProject({ projectId: this.projectId, userId }))
  }

  cancelInvitation(userId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: "Da li sigurno želite da opozovete ovu pozivnicu?",
      actionToDispatch: usersActions.cancelProjectInvitation({projectId: this.projectId, userId})
    }));
  }

  get formUsers() {
    return this.usersForm.get('users') as FormArray;
  }
}
