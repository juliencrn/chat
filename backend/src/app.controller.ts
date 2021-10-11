import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";
import { Public } from "./auth/auth.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { message: string } {
    return { message: this.appService.getHello() };
  }

  @Public()
  @Get("array")
  findAll() {
    return [];
  }
}
