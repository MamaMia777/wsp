import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ProgressManagerService } from 'src/app/ProgressManagerService';

@WebSocketGateway({ cors: false })
export class AppGateway implements OnGatewayInit {
  constructor(private progressManager: ProgressManagerService) {}
  @WebSocketServer() server: Server;
  afterInit() {
    Logger.log('AppGateway initialized');
    this.progressManager.server = this.server;
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    });
    this.server.emit('hello', 'world');
  }
}
