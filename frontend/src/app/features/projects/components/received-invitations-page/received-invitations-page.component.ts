import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { PageEvent } from '@angular/material/paginator';
import * as projectsActions from '../../state/projects.actions';
import * as usersActions from '../../../users/state/users.actions';
import * as sharedActions from '../../../../shared/state/shared.actions';
import * as authSelectors from '../../../auth/state/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../../users/models/user.interface';

@Component({
  selector: 'app-received-invitations-page',
  templateUrl: './received-invitations-page.component.html',
  styleUrl: './received-invitations-page.component.scss'
})
export class ReceivedInvitationsPageComponent {

  loggedInUser$!: Observable<User | null | undefined>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectDataFromStore();
    this.loadInvitations(1, 10);
  }

  selectDataFromStore() {
    this.loggedInUser$ = this.store.select(authSelectors.selectCurrentLoggedInUser);
  }

  onPaginateChange(pageEvent: PageEvent) {
    this.loadInvitations(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }

  loadInvitations(page: number, limit: number) {
    this.store.dispatch(projectsActions.loadReceivedInvitations({ options: { page, limit } }));
  }

  acceptInvitation(projectId: number) {
    this.store.dispatch(usersActions.acceptProjectInvitation({projectId}));
  }

  declineInvitation(projectId: number, userId: number) {
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: 'Da li sigurno želite da odbijete ovu pozivnicu?',
      actionToDispatch: usersActions.cancelProjectInvitation({projectId, userId})
    }))
  }
}
