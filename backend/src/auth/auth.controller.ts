import {
  Body,
  Controller,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";
import MongooseClassSerializerInterceptor from "src/interceptors/mongooseClassSerializer.interceptor";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/schemas/user.schema";

import { Public } from "./auth.decorator";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
@SerializeOptions({ excludePrefixes: ["_"] })
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req: Request & { user: User }) {
    return await this.authService.login(req.user);
  }

  @Public()
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
}
