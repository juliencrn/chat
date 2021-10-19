import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  SerializeOptions,
  UseInterceptors,
} from "@nestjs/common";
import to from "await-to-js";
import MongooseClassSerializerInterceptor from "src/interceptors/mongooseClassSerializer.interceptor";

import { User } from "./schemas/user.schema";
import { UsersService } from "./users.service";

@Controller("users")
@SerializeOptions({ excludePrefixes: ["_"] })
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get("profile")
  async profile(@Req() req: any) {
    return await this.findOne(req.user.id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const [err, user] = await to(this.usersService.findById(id));

    if (!user || err) {
      throw new NotFoundException("Could not find user");
    }

    return user;
  }
}
