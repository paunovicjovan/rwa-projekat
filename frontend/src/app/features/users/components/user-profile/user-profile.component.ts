import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import * as usersSelectors from '../../state/users.selectors'
import { combineLatest, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  
  constructor(private store: Store<AppState>) {}

  dataFromStore$!: Observable<any>;
  apiUrl: string = environment.apiUrl;

  ngOnInit(): void {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(usersSelectors.selectIsLoading),
      chosenUserProfile: this.store.select(usersSelectors.selectChosenUserProfile)
    })
  }
}
