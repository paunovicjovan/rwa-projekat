import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { ChatsPageComponent } from './components/chats-page/chats-page.component';
import { CustomSocket } from './sockets/custom-socket';
import { EffectsModule } from '@ngrx/effects';
import * as chatEffects from './state/chat.effects';
import { StoreModule } from '@ngrx/store';
import { Features } from '../features.enum';
import { chatsReducer } from './state/chat.reducer';
import { UsersModule } from "../users/users.module";
import { RoomFormDialogComponent } from './components/room-form-dialog/room-form-dialog.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { MessageDisplayComponent } from './components/message-display/message-display.component';



@NgModule({
  declarations: [
    ChatsPageComponent,
    RoomFormDialogComponent,
    ChatroomComponent,
    MessageDisplayComponent
  ],
  imports: [
    SharedModule,
    AuthModule,
    EffectsModule.forFeature(chatEffects),
    StoreModule.forFeature(Features.Chats, chatsReducer),
    UsersModule
],
  providers: [CustomSocket]
})
export class ChatModule { }
