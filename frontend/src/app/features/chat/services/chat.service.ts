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

  getMessage(): Observable<string> {
    return this.socket.fromEvent('messageResponse')
  }

  loadRooms(): Observable<PaginatedResponse<Room>> {
    return this.socket.fromEvent<PaginatedResponse<Room>>('rooms');
  }
}
