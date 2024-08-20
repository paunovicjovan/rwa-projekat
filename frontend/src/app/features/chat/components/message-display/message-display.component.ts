import { Component, Input } from '@angular/core';
import { Message } from '../../models/message.interface';

@Component({
  selector: 'app-message-display',
  templateUrl: './message-display.component.html',
  styleUrl: './message-display.component.scss'
})
export class MessageDisplayComponent {
  @Input({required: true}) message!: Message;

}
