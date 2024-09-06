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
import { MoreMessagesDto } from '../../models/message/more-messages-dto.interface';
import { User } from '../../../users/models/user.interface';
import { UpdateRoomMembershipDto } from '../../models/room/update-room-membership-dto.interface';
import * as sharedActions from '../../../../shared/state/shared.actions';

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
    this.selectDataFromStore();
  }

  initializeForm() {
    this.newMessageForm = this.formBuilder.group({
      text: [null, [Validators.required]]
    })
  }

  selectDataFromStore() {
    this.dataFromStore$ = combineLatest({
      messages: this.store.select(chatsSelectors.selectMessages),
      loggedInUser: this.store.select(authSelectors.selectCurrentLoggedInUser),
      roomMembers: this.store.select(usersSelectors.selectUsers),
      messagesPaginationMetadata: this.store.select(chatsSelectors.selectMessagesPaginationMetadata),
      isLoading: this.store.select(chatsSelectors.selectIsLoading)
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
        this.messagesScroller.nativeElement.scrollTop = currentScrollHeight;
        this.previousScrollHeight = currentScrollHeight;
      }
    }
  }
  
  handleEditChatroom() {
    this.editChatroom.emit(this.chatroom!);
  }

  handleLeaveChatroom(loggedInUser: User) {
    const dto: UpdateRoomMembershipDto = {
      roomId: this.chatroom!.id,
      user: loggedInUser
    }
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: 'Da li sigurno želite da napustite chat?',
      actionToDispatch: chatsActions.removeUserFromRoom({dto})
    }));
  }

  handleDeleteChatroom() {
    console.log('delete');
  }

  handleAddUser(user: User) {
    const dto: UpdateRoomMembershipDto = {
      roomId: this.chatroom!.id,
      user
    }
    this.store.dispatch(chatsActions.addUserToRoom({dto}));
  }

  handleRemoveUser(user: User) {
    const dto: UpdateRoomMembershipDto = {
      roomId: this.chatroom!.id,
      user
    }
    this.store.dispatch(sharedActions.openConfirmationDialog({
      message: 'Da li sigurno želite da uklonite korisnika iz chat-a?',
      actionToDispatch: chatsActions.removeUserFromRoom({dto})
    }));
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
