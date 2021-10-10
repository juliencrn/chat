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

interface UserConnection {
  userId: string;
  connectionId: string;
}

@UseGuards(WebSocketJwtAuthGuard)
@WebSocketGateway({
  // TODO: Use environnement variable instead
  cors: { origin: 'http://localhost:3000' },
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userCount = 0;
  private users = new Map();
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  async afterInit(/*server: Server*/) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    const userMap = this.getUserMap(client);
    const userConnection = this.mapToUserConnection(userMap);

    // Print new connected user
    this.logger.log(`Client connected`, userConnection);
    this.server.emit('user', userConnection);

    // Add user to the users map
    this.users.set(...userMap);

    // Print users map
    const users = [...this.users].map(this.mapToUserConnection);
    this.server.emit('users', users);
  }

  async handleDisconnect(client: Socket) {
    const userMap = this.getUserMap(client);
    const userConnection = this.mapToUserConnection(userMap);

    // Print new disconnected user
    this.logger.log(`Client disconnected`, userConnection);
    this.server.emit('user', userConnection);

    // Remove user from the users map
    this.users.delete(userMap[0]);

    // Print users map
    const users = [...this.users].map(this.mapToUserConnection);
    this.server.emit('users', users);
  }

  @SubscribeMessage('message')
  async onChat(@MessageBody() [userId, text]: [string, string]) {
    const chatMessage = await this.messagesService.create({ userId, text });
    const serializedMessage = this.messagesService.serialize(chatMessage);

    this.logger.log(`Message received "${text}"`);
    this.server.emit('message', excludePrefix(serializedMessage));
  }

  private mapToUserConnection(
    userMapItem: [userId: string, connectionId: string],
  ): UserConnection {
    return {
      userId: userMapItem[0],
      connectionId: userMapItem[1],
    };
  }

  private getUserMap(client: Socket): [string, string] {
    const userId: string = client.handshake.query.userId.toString();
    return [userId, client.id];
  }
}

// TODO: It's not the Nest way
function excludePrefix(obj: Record<string, any>): Record<string, any> {
  for (const key in obj) {
    if (key.slice(0, 1) === '_') {
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
