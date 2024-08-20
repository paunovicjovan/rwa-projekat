import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../models/room.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { combineLatest, Observable } from 'rxjs';
import * as authSelectors from '../../../auth/state/auth.selectors';
import * as chatsSelectors from '../../state/chat.selectors';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent implements OnInit {

  @Input({required: true}) chatroom!: Room | null;
  dataFromStore$!: Observable<any>

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.dataFromStore$ = combineLatest({
      messages: this.store.select(chatsSelectors.selectMessages),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser)
    })
  }

}
