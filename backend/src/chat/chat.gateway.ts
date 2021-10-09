import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import { WebSocketJwtAuthGuard } from 'src/auth/guards/websocket-jwt-auth.guard';

@UseGuards(WebSocketJwtAuthGuard)
@WebSocketGateway({
  // TODO: Use environnement variable instead
  cors: { origin: 'http://localhost:3000' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  userCount = 0;

  private logger: Logger = new Logger('ChatGateway');

  async afterInit(/*server: Server*/) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    this.userCount++;
    this.server.emit('user_count', this.userCount);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
    this.userCount--;
    this.server.emit('user_count', this.userCount);
  }

  @SubscribeMessage('message')
  async onChat(@MessageBody() [username, text]: [string, string]) {
    // TODO: Replace by a Model
    const chatMessage = {
      id: randomUUID(),
      postedAt: Date.now(),
      username,
      text,
    };

    this.logger.log(`Message received "${text}"`, chatMessage);
    this.server.emit('message', chatMessage);
  }
}
