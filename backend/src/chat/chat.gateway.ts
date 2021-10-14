import { Logger, UseGuards } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WebSocketJwtAuthGuard } from "src/auth/guards/websocket-jwt-auth.guard";
import { MessagesService } from "src/messages/messages.service";
import { UsersService } from "src/users/users.service";

interface UserConnection {
  userId: string;
  connectionId: string;
}

interface CreateSocketMessageDto {
  text: string;
  userId: string;
  threadId: string;
}

@UseGuards(WebSocketJwtAuthGuard)
@WebSocketGateway({
  // TODO: Use environnement variable instead
  cors: { origin: "http://localhost:3000" },
  transports: ["websocket"],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userConnections = [];
  private logger: Logger = new Logger("ChatGateway");

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

  async afterInit(/*server: Server*/) {
    this.logger.log("Init");
  }

  async handleConnection(client: Socket) {
    const userConnection = this.getConnection(client);

    this.userConnections.push(userConnection);

    this.logger.log(`Client connected (${JSON.stringify(userConnection)})`);
    this.server.emit("users", this.userConnections);
  }

  async handleDisconnect(client: Socket) {
    const userConnection = this.getConnection(client);

    // Remove connection from the users
    this.userConnections = this.userConnections.filter(
      conn => conn.connectionId !== userConnection.connectionId,
    );

    this.logger.log(`Client disconnected (${JSON.stringify(userConnection)})`);
    this.server.emit("users", this.userConnections);
  }

  @SubscribeMessage("users")
  async onUsers() {
    this.server.emit("users", this.userConnections);
  }

  @SubscribeMessage("message")
  async onChat(@MessageBody() createMessageDto: CreateSocketMessageDto) {
    const { userId: ownerId, ...dto } = createMessageDto;

    const chatMessage = await this.messagesService.create(dto, ownerId);
    const serializedMessage = this.messagesService.serialize(chatMessage);

    this.logger.log(`Message received "${createMessageDto.text}"`);
    this.server.emit("message", excludePrefix(serializedMessage));
  }

  private getConnection(client: Socket): UserConnection {
    const userId: string = client.handshake.query.userId.toString();
    return { userId, connectionId: client.id };
  }
}

// TODO: It's not the Nest way
function excludePrefix(obj: Record<string, any>): Record<string, any> {
  for (const key in obj) {
    if (key.slice(0, 1) === "_") {
      delete obj[key];
    }
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (typeof element === "object") {
        obj[key] = excludePrefix(element);
      }
    }
  }
  return obj;
}
