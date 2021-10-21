import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ChatModule } from "./chat/chat.module";
import { MessagesModule } from "./messages/messages.module";
import { ThreadsModule } from "./threads/threads.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ChatModule,
    MessagesModule,
    // TODO: Use environnement variable instead
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chat",
    ),
    AuthModule,
    UsersModule,
    ThreadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
