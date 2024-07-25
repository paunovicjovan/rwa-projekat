import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UsersFilters } from '../../models/users-filters.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import * as usersSelectors from '../../state/users.selectors';
import * as usersActions from '../../state/users.actions';
import { FilterUsersRequest } from '../../models/filter-users-request.interface';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss'
})
export class UsersPageComponent implements OnInit {

  filtersState!: UsersFilters;
  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.filtersState = {
      username: '',
      firstName: '',
      lastName: ''
    }

    this.selectDataFromStore();
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(usersSelectors.selectIsLoading),
      filteredUsers: this.store.select(usersSelectors.selectFilteredUsers),
      paginationMetadata: this.store.select(usersSelectors.selectUsersPaginationMetadata)
    })
  }

  onPaginateChange(event: PageEvent) {
    const filterData: FilterUsersRequest = {
      ...this.filtersState,
      page: event.pageIndex + 1,
      limit: event.pageSize
    }
    this.store.dispatch(usersActions.filterUsers({ filterData }));
  }

  onFilterChange(filters: UsersFilters) {
    this.filtersState = filters;
    const filterData: FilterUsersRequest = {
      ...filters,
      page: 1,
      limit: 10
    }
    this.store.dispatch(usersActions.filterUsers({ filterData }));
  }
}
