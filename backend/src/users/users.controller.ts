import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
@SerializeOptions({ excludePrefixes: ['_'] })
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  async profile(@Req() req: any) {
    return await this.findOne(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let user;
    try {
      user = await this.usersService.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find user');
    }
    if (!user) {
      throw new NotFoundException('Could not find user');
    }
    return user;
  }
}
