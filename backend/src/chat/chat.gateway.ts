import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import {
  Logger,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketJwtAuthGuard } from 'src/auth/guards/websocket-jwt-auth.guard';
import { MessagesService } from 'src/messages/messages.service';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

enum EventNames {
  user_count = 'user_count',
  message = 'message',
}

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

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  async afterInit(/*server: Server*/) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected ${client.id}`);
    // console.log('handshake', client.handshake);
    this.userCount++;
    this.server.emit(EventNames.user_count, this.userCount);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected ${client.id}`);
    this.userCount--;
    this.server.emit(EventNames.user_count, this.userCount);
  }

  @SubscribeMessage(EventNames.message)
  async onChat(@MessageBody() [userId, text]: [string, string]) {
    const chatMessage = await this.messagesService.create({ userId, text });
    const serializedMessage = this.messagesService.serialize(chatMessage);

    this.logger.log(`Message received "${text}"`);
    this.server.emit(EventNames.message, excludePrefix(serializedMessage));
  }
}

// TODO: It's not the Nest way
function excludePrefix(
  obj: Record<string, any>,
  prefix?: string,
): Record<string, any> {
  for (const key in obj) {
    if (key.slice(0, 1) === prefix ?? '_') {
      delete obj[key];
    }
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (typeof element === 'object') {
        obj[key] = excludePrefix(element);
      }
    }
  }
  return obj;
}
