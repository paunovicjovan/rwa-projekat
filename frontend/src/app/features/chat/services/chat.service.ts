import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CustomSocket } from '../sockets/custom-socket';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { Room } from '../models/room.interface';
import { PaginationParameters } from '../../../shared/models/pagination-parameters.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // constructor(@Inject(CustomSocket) private socket: CustomSocket) { }
  constructor(private socket: CustomSocket) { }

  connect(jwt: string | null) {
    this.socket.ioSocket.io.opts.extraHeaders = { Authorization: jwt };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  getMessage(): Observable<string> {
    return this.socket.fromEvent('messageResponse')
  }

  getRooms(): Observable<PaginatedResponse<Room>> {
    return this.socket.fromEvent<PaginatedResponse<Room>>('rooms');
  }

  loadRooms(paginationOptions: PaginationParameters) {
    this.socket.emit('loadRooms', {page: paginationOptions.page, limit: paginationOptions.limit});
  }
}
