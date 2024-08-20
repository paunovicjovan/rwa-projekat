import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as chatActions from '../../state/chat.actions';
import * as chatSelectors from '../../state/chat.selectors';
import { combineLatest, Observable } from 'rxjs';
import { Room } from '../../models/room.interface';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { PaginationParameters } from '../../../../shared/models/pagination-parameters.interface';

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {

  dataFromStore$!: Observable<any>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(chatActions.connect());
    // this.store.dispatch(chatActions.loadRooms({paginationOptions: {page: 1, limit: 10}}));
    this.selectDataFromStore();
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      rooms: this.store.select(chatSelectors.selectRooms),
      paginationMetadata: this.store.select(chatSelectors.selectPaginationMetadata),
      chosenRoom: this.store.select(chatSelectors.selectChosenRoom)
    })
  }

  handleSelectRoom(event: MatSelectionListChange) {
    const selectedRoom = event.source.selectedOptions.selected[0].value;
    this.store.dispatch(chatActions.chooseRoom({ roomId: selectedRoom.id }))
  }

  onPaginateChange(event: PageEvent) {
    const paginationOptions: PaginationParameters = {
      page: event.pageIndex + 1,
      limit: event.pageSize
    }
    this.store.dispatch(chatActions.loadRooms({paginationOptions}))
  }

  openNewRoomDialog() {
    this.store.dispatch(chatActions.openRoomDialog({dialogData: undefined}));
  }
}
