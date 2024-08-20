import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../../../environments/environment.development';

const config: SocketIoConfig = { 
    url: environment.socketUrl, 
    options: {
      autoConnect: false
    }
};

// @Injectable({ providedIn: 'root' })
export class CustomSocket extends Socket {
  constructor() {
    super(config);
  }
}
