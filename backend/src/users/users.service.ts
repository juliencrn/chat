import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPublic, User, UserDocument } from './schemas/user.schema';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if the username is available
    const { username, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new BadRequestException('Chosen username is already taken');
    }
    const createdUser = new this.userModel({ username, password });
    return createdUser.save();
  }

  async findOne(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username }).exec();
  }

  toPublic(user: UserDocument): UserPublic {
    const { _id, username, createdAt } = user;
    return { id: _id, username, createdAt };
  }
}
