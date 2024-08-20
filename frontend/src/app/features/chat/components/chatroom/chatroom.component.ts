import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Room } from '../../models/room.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { combineLatest, Observable } from 'rxjs';
import * as authSelectors from '../../../auth/state/auth.selectors';
import * as chatsSelectors from '../../state/chat.selectors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as chatsActions from '../../state/chat.actions';
import { CreateMessageDto } from '../../models/create-message-dto.interface';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent implements OnInit, OnChanges, OnDestroy {

  @Input({required: true}) chatroom!: Room | null;
  dataFromStore$!: Observable<any>;
  newMessageForm!: FormGroup;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.dataFromStore$ = combineLatest({
      messages: this.store.select(chatsSelectors.selectMessages),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser)
    })
  }

  initializeForm() {
    this.newMessageForm = this.formBuilder.group({
      text: [null, [Validators.required]]
    })
  }

  changeTextareaHeight(event: any) {
    let suggestedHeight = event.target.scrollHeight;
    const maximumTextareaHeightInPx = 75;
    suggestedHeight = Math.min(suggestedHeight, maximumTextareaHeightInPx);
    event.target.style.height = suggestedHeight + 'px';
  }

  sendMessage() {
    const createMessageDto: CreateMessageDto = {
      text: this.newMessageForm.get('text')!.value,
      room: this.chatroom!
    }
    this.store.dispatch(chatsActions.sendMessage({createMessageDto}));
    this.newMessageForm.get('text')?.setValue(null);
  }

  ngOnChanges(): void {
    this.store.dispatch(chatsActions.leaveRoom());
    if(this.chatroom) {
      this.store.dispatch(chatsActions.joinRoom({room: this.chatroom}));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(chatsActions.leaveRoom());
  }
  
}
