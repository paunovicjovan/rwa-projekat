import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
import { UsersFilters } from '../../models/users-filters.interface';

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
  @Output() onFilterChange: EventEmitter<UsersFilters> = new EventEmitter<UsersFilters>();

  constructor(private formBuilder: FormBuilder) {}

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
      debounceTime(300),
      distinctUntilChanged()
    )
  }

  observeFilterChanges() {
    const combinedFilters$ = combineLatest([this.username$, this.firstName$, this.lastName$]);

    this.filtersSubscription = combinedFilters$
    .subscribe(
      ([username, firstName, lastName]) => {
        this.onFilterChange.emit({username, firstName, lastName});
      }
    );
  }

  ngOnDestroy(): void {
    this.filtersSubscription?.unsubscribe();
  }
}
