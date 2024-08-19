import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CustomSocket } from '../sockets/custom-socket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // constructor(@Inject(CustomSocket) private socket: CustomSocket) { }
  constructor(private socket: CustomSocket) { }

  getMessage(): Observable<string> {
    return this.socket.fromEvent('messageResponse')
  }
}
