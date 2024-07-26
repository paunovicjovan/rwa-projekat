import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import * as usersSelectors from '../../state/users.selectors';
import * as usersActions from '../../state/users.actions';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.scss'
})
export class UserProfilePageComponent implements OnInit, OnDestroy {

  routeParamsSubscription?: Subscription;
  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>,
              private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.observeRouteChanges();
    this.selectDataFromStore();
  }

  observeRouteChanges() {
    this.routeParamsSubscription = this.activatedRoute.params
    .pipe(map((params: Params) => params['username']))
    .subscribe(username => this.loadUserProfile(username));
  }

  loadUserProfile(username: string) {
    this.store.dispatch(usersActions.loadUserProfile({ username }));
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(usersSelectors.selectIsLoading),
      chosenUserProfile: this.store.select(usersSelectors.selectChosenUserProfile)
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }
}
