import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import * as usersActions from '../../../users/state/users.actions';
import * as usersSelectors from '../../../users/state/users.selectors';
import * as sharedActions from '../../../../shared/state/shared.actions';
import { combineLatest, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ParticipantStatus } from '../../models/participant-status.enum';

@Component({
  selector: 'app-project-participants',
  templateUrl: './project-participants.component.html',
  styleUrl: './project-participants.component.scss'
})
export class ProjectParticipantsComponent implements OnInit {

  @Input({required: true}) projectId!: number;
  dataFromStore$!: Observable<any>;
  selectedParticipantsView!: ParticipantStatus;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadAcceptedUsersForProject(1, 10);
    this.selectDataFromStore();
  }

  onTabChange(event: any) {
    if(event.index === 0) {
      this.loadAcceptedUsersForProject(1, 10);
    }
    else {
      this.loadAppliedUsersForProject(1, 10);
    }
  }

  onPaginateChange(pageEvent: PageEvent) {
    if(this.selectedParticipantsView === ParticipantStatus.Applied) {
      this.loadAppliedUsersForProject(pageEvent.pageIndex + 1, pageEvent.pageSize);
    }
    else {
      this.loadAcceptedUsersForProject(pageEvent.pageIndex + 1, pageEvent.pageSize);
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
}
