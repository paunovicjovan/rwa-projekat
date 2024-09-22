import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { PageEvent } from '@angular/material/paginator';
import * as projectsActions from '../../state/projects.actions';
import { PaginationOptions } from '../../../../shared/models/pagination-options.interface';

@Component({
  selector: 'app-received-invitations-page',
  templateUrl: './received-invitations-page.component.html',
  styleUrl: './received-invitations-page.component.scss'
})
export class ReceivedInvitationsPageComponent {

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loadInvitations(1, 10);
  }

  onPaginateChange(pageEvent: PageEvent) {
    this.loadInvitations(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }

  loadInvitations(page: number, limit: number) {
    this.store.dispatch(projectsActions.loadReceivedInvitations({ options: { page, limit } }));
  }

  acceptInvitation() {

  }

  declineInvitation() {

  }
}
