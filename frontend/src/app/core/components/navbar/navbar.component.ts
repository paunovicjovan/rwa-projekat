import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as authSelectors from '../../../features/auth/state/auth.selectors';
import * as authActions from '../../../features/auth/state/auth.actions';
import { combineLatest, Observable } from 'rxjs';
import { User } from '../../../features/users/models/user.interface';
import { environment } from '../../../../environments/environment.development';
import * as usersActions from '../../../features/users/state/users.actions';
import * as usersSelectors from '../../../features/users/state/users.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  dataFromStore$!: Observable<any>;
  apiUrl: string = environment.apiUrl;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectDataFromStore();
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      currentUser: this.store.select(authSelectors.selectCurrentLoggedInUser),
      invitationsCount: this.store.select(usersSelectors.selectInvitationsCount)
    });
  }

  loadInvitationsCount() {
    this.store.dispatch(usersActions.loadInvitationsCount());
  }

  logout() {
    this.store.dispatch(authActions.logout());
  }

}
