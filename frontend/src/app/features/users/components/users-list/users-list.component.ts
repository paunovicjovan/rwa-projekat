import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { AppState } from '../../../../state/app-state.interface';
import * as usersSelectors from '../../state/users.selectors';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {

  dataFromStore$!: Observable<any>;
  @Input() isPaginationVisible: boolean = true;
  @Output() paginateChange: EventEmitter<PageEvent> = new EventEmitter();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.selectDataFromStore();
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      isLoading: this.store.select(usersSelectors.selectIsLoading),
      users: this.store.select(usersSelectors.selectUsers),
      paginationMetadata: this.store.select(usersSelectors.selectUsersPaginationMetadata)
    })
  }

  onPaginateChange(pageEvent: PageEvent) {
    this.paginateChange.emit(pageEvent);
  }
}
