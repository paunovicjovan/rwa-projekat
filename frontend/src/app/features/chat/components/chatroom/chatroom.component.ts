import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Room } from '../../models/room/room.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../state/app-state.interface';
import { combineLatest, Observable } from 'rxjs';
import * as authSelectors from '../../../auth/state/auth.selectors';
import * as chatsSelectors from '../../state/chat.selectors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as chatsActions from '../../state/chat.actions';
import { CreateMessageDto } from '../../models/message/create-message-dto.interface';
import * as usersSelectors from '../../../users/state/users.selectors';
import { PaginationMetadata } from '../../../../shared/models/pagination-metadata.interface';
import { PaginationOptions } from '../../../../shared/models/pagination-options.interface';
import { MoreMessagesDto } from '../../models/message/more-messages-dto.interface';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {

  @Input({required: true}) chatroom!: Room | null;
  @Output() editChatroom: EventEmitter<Room> = new EventEmitter();
  @ViewChild('messages', {static:false}) private messagesScroller!: ElementRef;
  dataFromStore$!: Observable<any>;
  newMessageForm!: FormGroup;
  previousScrollHeight: number = 0;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.dataFromStore$ = combineLatest({
      messages: this.store.select(chatsSelectors.selectMessages),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser),
      roomMembers: this.store.select(usersSelectors.selectUsers),
      messagesPaginationMetadata: this.store.select(chatsSelectors.selectMessagesPaginationMetadata),
      isLoading: this.store.select(chatsSelectors.selectIsLoading)
    })
  }

  initializeForm() {
    this.newMessageForm = this.formBuilder.group({
      text: [null, [Validators.required]]
    })
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
      this.previousScrollHeight = 0;
      this.store.dispatch(chatsActions.joinRoom({room: this.chatroom}));
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToNewMessages();
  }

  scrollToNewMessages() {
    if(this.messagesScroller && this.messagesScroller.nativeElement) {
      const currentScrollHeight = this.messagesScroller.nativeElement.scrollHeight;
      if (currentScrollHeight > this.previousScrollHeight) {
        this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight;
        this.previousScrollHeight = currentScrollHeight;
      }
    }
  }
  
  handleEditChatroom() {
    this.editChatroom.emit(this.chatroom!);
  }

  loadMoreMessages(paginationMetadata: PaginationMetadata) {
    const request: MoreMessagesDto = {
      roomId: this.chatroom!.id,
      page: paginationMetadata.currentPage + 1,
      limit: paginationMetadata.itemsPerPage
    }
    this.store.dispatch(chatsActions.loadMoreMessages({ request }));
  }
  
  ngOnDestroy(): void {
    this.store.dispatch(chatsActions.leaveRoom());
  }
  
}
