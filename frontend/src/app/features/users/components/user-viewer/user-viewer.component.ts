import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { User } from '../../models/user.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Observable, Subscription, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import * as usersActions from '../../state/users.actions';
import * as usersSelectors from '../../state/users.selectors';
import { FilterUsersRequest } from '../../models/filter-users-request.interface';
@Component({
  selector: 'app-user-viewer',
  templateUrl: './user-viewer.component.html',
  styleUrl: './user-viewer.component.scss'
})
export class UserViewerComponent implements OnDestroy {
  @Input({required: true}) users!: User[] | null;
  @Input() readonly: boolean = false;
  @Output() addUser: EventEmitter<User> = new EventEmitter();
  @Output() removeUser: EventEmitter<User> = new EventEmitter();

  searchUserControl = new FormControl();
  selectedUser: User | null = null;
  filteredUsers$!: Observable<(User | undefined)[]>;

  searchSubscription?: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.observeSearchChanges();
    this.selectDataFromStore();
  }

  observeSearchChanges() {
    this.searchSubscription = this.searchUserControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter((username: string) => username !== ''),
      tap((username: string) => {
        const filterData: FilterUsersRequest = {
          firstName: '',
          lastName: '',
          username: username,
          page: 1,
          limit: 10
        }
        this.store.dispatch(usersActions.autocompleteUsers({filterData}));
      })
    ).subscribe();
  }

  selectDataFromStore() {
    this.filteredUsers$ = this.store.select(usersSelectors.selectAutocompletedUsers)
  }

  handleAddUser() {
    this.addUser.emit(this.selectedUser!);
    this.selectedUser = null;
    this.searchUserControl.setValue(null);
  }

  handleRemoveUser(user: User) {
    this.removeUser.emit(user);
  }

  setSelectedUser(user: User) {
    this.selectedUser = user;
  }

  displayUser(user?: User) {
    return user?.username ?? '';
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}
