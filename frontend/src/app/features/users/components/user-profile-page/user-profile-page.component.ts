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
  username!: string;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.observeRouteChanges();
  }

  observeRouteChanges() {
    this.routeParamsSubscription = this.activatedRoute.params
    .pipe(map((params: Params) => params['username']))
    .subscribe(username => this.username = username);
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }
}
