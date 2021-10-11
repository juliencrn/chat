import { Module } from "@nestjs/common";
import { MessagesModule } from "src/messages/messages.module";
import { UsersModule } from "src/users/users.module";

import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [MessagesModule, UsersModule],
  providers: [ChatGateway],
})
export class ChatModule {}
