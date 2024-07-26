import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as authSelectors from '../../../features/auth/state/auth.selectors'
import { Observable } from 'rxjs';
import { User } from '../../../features/users/models/user.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  currentLoggedInUser$!: Observable<User | null | undefined>

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentLoggedInUser$ = this.store.select(authSelectors.selectCurrentLoggedInUser);
  }

}
