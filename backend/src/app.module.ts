import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";

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
    ConfigModule.forRoot(),
    ChatModule,
    MessagesModule,
    MongooseModule.forRoot(process.env.MONGO_URI, {
      retryWrites: true,
      w: "majority",
    }),
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
