import { Module } from "@nestjs/common";
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

// TODO: Use "only" environnement variable instead, throw instead
const mongo_uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chat";
const mongooseOptions: MongooseModuleOptions = {
  retryWrites: true,
  w: "majority",
  ssl: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

@Module({
  imports: [
    ChatModule,
    MessagesModule,
    MongooseModule.forRoot(mongo_uri, mongooseOptions),
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
