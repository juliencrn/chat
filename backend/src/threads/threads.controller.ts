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
import MongooseClassSerializerInterceptor from "src/interceptors/mongooseClassSerializer.interceptor";
import { User } from "src/users/schemas/user.schema";

import { CreateThreadDto } from "./dto/create-thread.dto";
import { UpdateThreadDto } from "./dto/update-thread.dto";
import { Thread } from "./schemas/thread.schema.";
import { ThreadsService } from "./threads.service";

@Controller("threads")
@SerializeOptions({ excludePrefixes: ["_"] })
@UseInterceptors(MongooseClassSerializerInterceptor(Thread))
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  create(@Body() createThreadDto: CreateThreadDto, @Req() req: Request) {
    const { id: ownerId } = req.user as Partial<User>;
    return this.threadsService.create(createThreadDto, ownerId);
  }

  @Get()
  findAll() {
    return this.threadsService.findAll();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.threadsService.findOneBySlug(slug);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() updateThreadDto: UpdateThreadDto,
  ) {
    const { id: ownerId } = req.user as Partial<User>;
    return this.threadsService.update(id, updateThreadDto, ownerId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: Request) {
    const { id: ownerId } = req.user as Partial<User>;
    return this.threadsService.remove(id, ownerId);
  }
}
