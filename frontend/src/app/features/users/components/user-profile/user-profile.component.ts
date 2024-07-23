import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { UserRoles } from '../../models/user-roles.enum';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import * as usersSelectors from '../../state/users.selectors'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  
  constructor(private store: Store<AppState>) {}

  dataFromStore$!: Observable<any>;

  ngOnInit(): void {
    this.dataFromStore$ = this.store.select(usersSelectors.selectIsLoadingAndUser);
  }
}
