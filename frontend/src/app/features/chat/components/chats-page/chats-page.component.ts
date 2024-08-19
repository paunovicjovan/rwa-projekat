import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AppState } from '../../../../state/app-state.interface';
import { Store } from '@ngrx/store';
import * as chatActions from '../../state/chat.actions';
import * as chatSelectors from '../../state/chat.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {

  message!: Observable<string | null>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(chatActions.connect());
    this.message = this.store.select(chatSelectors.selectTest)
  }
}
