import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ChatModule,
    MessagesModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/chat'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
