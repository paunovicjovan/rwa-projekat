import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../../../../state/app-state.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user-projects-page',
  templateUrl: './user-projects-page.component.html',
  styleUrl: './user-projects-page.component.scss'
})
export class UserProjectsPageComponent {

  routeParamsSubscription?: Subscription;
  username!: number;

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.observeRouteChanges();   
  }

  observeRouteChanges() {
    this.routeParamsSubscription = this.activatedRoute.params
    .pipe(map((params: Params) => params['username']))
    .subscribe(username => this.username = username);
  }

  handlePaginateChange(pageEvent: PageEvent) {

  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }
}
