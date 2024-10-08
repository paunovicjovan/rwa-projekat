import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription } from 'rxjs';
import { AppState } from '../../../../state/app-state.interface';
import { PageEvent } from '@angular/material/paginator';
import * as projectsActions from '../../state/projects.actions';
import { ProjectStatus } from '../../enums/project-status.enum';
import { User } from '../../../users/models/user.interface';
import * as authSelectors from '../../../auth/state/auth.selectors';

@Component({
  selector: 'app-user-projects-page',
  templateUrl: './user-projects-page.component.html',
  styleUrl: './user-projects-page.component.scss'
})
export class UserProjectsPageComponent {

  routeParamsSubscription?: Subscription;
  username!: string;
  selectedProjectStatus: ProjectStatus = ProjectStatus.OPENED;
  selectedTabIndex: number = 0;
  loggedInUser$!: Observable<User | null | undefined>;

  constructor(private activatedRoute: ActivatedRoute,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.observeRouteChanges();
    this.selectDataFromStore();
    this.findProjects(1, 10);
  }

  observeRouteChanges() {
    this.routeParamsSubscription = this.activatedRoute.params
    .pipe(map((params: Params) => params['username']))
    .subscribe(username => this.username = username);
  }

  selectDataFromStore() {
    this.loggedInUser$ = this.store.select(authSelectors.selectCurrentLoggedInUser)
  }

  handlePaginateChange(pageEvent: PageEvent) {
    this.findProjects(pageEvent.pageIndex + 1, pageEvent.pageSize);
  }

  handleStatusChange() {
    this.findProjects(1, 10);
  }

  handleTabChange() {
    this.findProjects(1, 10);
  }

  findProjects(page: number, limit: number) {
    switch(this.selectedTabIndex) {
      case 0:
        this.store.dispatch(projectsActions.findCreatedProjectsForUser({username: this.username, 
                                                                        status: this.selectedProjectStatus, 
                                                                        paginationOptions: {page, limit}}));
        break;
      case 1:
        this.store.dispatch(projectsActions.findAcceptedProjectsForUser({username: this.username, 
                                                                        isCompleted: true, 
                                                                        paginationOptions: { page, limit }}));
        break;
      case 2:
        this.store.dispatch(projectsActions.findAcceptedProjectsForUser({username: this.username, 
                                                                        isCompleted: false, 
                                                                        paginationOptions: { page, limit }}));
        break;
      case 3:
        this.store.dispatch(projectsActions.findAppliedProjectsForUser({username: this.username, 
                                                                        paginationOptions: {page, limit}}));
        break;
    }
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }
}
