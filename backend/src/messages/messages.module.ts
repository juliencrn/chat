import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThreadsModule } from "src/threads/threads.module";
import { UsersModule } from "src/users/users.module";

import { MessagesController } from "./messages.controller";
import { MessagesService } from "./messages.service";
import { Message, MessageSchema } from "./schemas/message.schema";

@Module({
  imports: [
    UsersModule,
    ThreadsModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
