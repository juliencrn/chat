import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SerializeOptions,
  UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import { UserRequestBody } from "src/auth/auth.service";
import MongooseClassSerializerInterceptor from "src/interceptors/mongooseClassSerializer.interceptor";

import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessagesService } from "./messages.service";
import { Message } from "./schemas/message.schema";

@Controller("messages")
@SerializeOptions({ excludePrefixes: ["_"] })
@UseInterceptors(MongooseClassSerializerInterceptor(Message))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Req() req: Request) {
    const { id: ownerId } = req.user as UserRequestBody;
    return this.messagesService.create(createMessageDto, ownerId);
  }

  @Get()
  findAllBy(@Req() req: Request) {
    const lastId = (req.query?.lastId as string) || undefined;
    const limit = Number(req.query?.limit) || 10;
    const threadId = (req.query.threadId as string) || undefined;

    return this.messagesService.findAllByThread({
      lastId,
      threadId,
      limit,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Req() req: Request,
  ) {
    const { id: ownerId } = req.user as UserRequestBody;
    return this.messagesService.update(id, updateMessageDto, ownerId);
  }

  @Delete(":id")
  delete(@Param("id") id: string, @Req() req: Request) {
    const { id: ownerId } = req.user as UserRequestBody;
    return this.messagesService.delete(id, ownerId);
  }
}
