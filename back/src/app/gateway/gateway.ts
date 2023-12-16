import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MyGateway implements OnModuleInit {
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Connected to client: ${socket.id}`);
    });
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('parseCategory')
  async onNewMessage(@MessageBody() body: { categoryId: string }) {}
}
