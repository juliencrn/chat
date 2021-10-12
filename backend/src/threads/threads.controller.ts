import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
} from "@nestjs/common";
import MongooseClassSerializerInterceptor from "src/interceptors/mongooseClassSerializer.interceptor";

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
  create(@Body() createThreadDto: CreateThreadDto) {
    return this.threadsService.create(createThreadDto);
  }

  @Get()
  findAll() {
    return this.threadsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.threadsService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateThreadDto: UpdateThreadDto) {
    return this.threadsService.update(id, updateThreadDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.threadsService.remove(id);
  }
}
