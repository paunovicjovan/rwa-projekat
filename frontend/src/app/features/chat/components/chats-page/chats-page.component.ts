import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chats-page',
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPageComponent {

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getMessage().subscribe();
  }
}
