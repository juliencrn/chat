import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Thread, ThreadSchema } from "./schemas/thread.schema.";
import { ThreadsController } from "./threads.controller";
import { ThreadsService } from "./threads.service";

@Module({
  imports: [
    // UsersModule,
    MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService],
  exports: [ThreadsService],
})
export class ThreadsModule {}
