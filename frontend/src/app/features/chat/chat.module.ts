import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../../environments/environment.development';
import { ChatsPageComponent } from './components/chats-page/chats-page.component';



@NgModule({
  declarations: [
    ChatsPageComponent
  ],
  imports: [
    SharedModule,
    AuthModule
  ],
  providers: [Socket]
})
export class ChatModule { }
