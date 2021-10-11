import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { classToPlain, plainToClass } from "class-transformer";
import { Model } from "mongoose";

import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Check if the username is available
    const { username, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new BadRequestException("Chosen username is already taken");
    }
    const createdUser = new this.userModel({ username, password });
    return createdUser.save();
  }

  async findById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find().exec();
    if (!users) {
      return [];
    }
    return users;
  }

  serialize(doc: UserDocument): Record<string, any> {
    return classToPlain(plainToClass(User, doc.toObject()));
  }
}
