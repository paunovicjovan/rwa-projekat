import { Component } from '@angular/core';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as chatActions from '../../state/chat.actions';
import * as chatSelectors from '../../state/chat.selectors';
import { combineLatest, Observable } from 'rxjs';
import { Room } from '../../models/room/room.interface';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { PaginationOptions } from '../../../../shared/models/pagination-options.interface';

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
    this.selectDataFromStore();
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      rooms: this.store.select(chatSelectors.selectRooms),
      paginationMetadata: this.store.select(chatSelectors.selectRoomsPaginationMetadata),
      chosenRoom: this.store.select(chatSelectors.selectChosenRoom)
    })
  }

  handleSelectRoom(event: MatSelectionListChange) {
    const selectedRoom = event.source.selectedOptions.selected[0].value;
    this.store.dispatch(chatActions.chooseRoom({ roomId: selectedRoom.id }))
  }

  onPaginateChange(event: PageEvent) {
    const paginationOptions: PaginationOptions = {
      page: event.pageIndex + 1,
      limit: event.pageSize
    }
    this.store.dispatch(chatActions.loadRooms({paginationOptions}))
  }

  openNewRoomDialog() {
    this.store.dispatch(chatActions.openRoomDialog({dialogData: undefined}));
  }

  openEditRoomDialog(room: Room) {
    this.store.dispatch(chatActions.openRoomDialog({dialogData: room}))
  }
}
