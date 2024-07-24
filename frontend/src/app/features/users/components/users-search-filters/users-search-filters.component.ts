import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  Subscription,
} from 'rxjs';
import { AppState } from '../../../../state/app-state.interface';
import * as usersActions from '../../state/users.actions'
import { FilterUsersRequest } from '../../models/filter-users-request.interface';

@Component({
  selector: 'app-users-search-filters',
  templateUrl: './users-search-filters.component.html',
  styleUrl: './users-search-filters.component.scss',
})
export class UsersSearchFiltersComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  username$!: Observable<string>;
  firstName$!: Observable<string>;
  lastName$!: Observable<string>;
  filtersSubscription?: Subscription;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeFormFieldsStreams();
    this.observeFilterChanges();
  }

  initializeForm() {
    this.searchForm = this.formBuilder.group({
      username: [''],
      firstName: [''],
      lastName: [''],
    });
  }

  initializeFormFieldsStreams() {
      this.username$ = this.getFormFieldStream('username')!;
      this.firstName$ = this.getFormFieldStream('firstName')!;
      this.lastName$ = this.getFormFieldStream('lastName')!;
  }

  getFormFieldStream(fieldName: string) : Observable<string> | undefined {
    const formControl = this.searchForm.get(fieldName);

    return formControl?.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      distinctUntilChanged()
    )
  }

  observeFilterChanges() {
    const combinedFilters$ = combineLatest([this.username$, this.firstName$, this.lastName$]);

    this.filtersSubscription = combinedFilters$
    .subscribe(
      ([firstName, lastName, username]) => {
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Username:', username);
        //fix
        const data : FilterUsersRequest = {
          limit:10,
          page: 1,
          firstName,
          lastName,
          username
        }
        this.store.dispatch(usersActions.filterUsers({filterData: data}));
      }
    );
  }

  ngOnDestroy(): void {
    this.filtersSubscription?.unsubscribe();
  }
}
