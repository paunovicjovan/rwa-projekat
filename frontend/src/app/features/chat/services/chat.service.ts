import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { CustomSocket } from '../sockets/custom-socket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket) { }

  getMessage() {
    return this.socket.fromEvent('messageResponse').pipe(
      tap(message => console.log(message))
    )
  }
}
