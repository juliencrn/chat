import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { classToPlain, plainToClass } from "class-transformer";
import { isValidObjectId, Model, mongo } from "mongoose";
import { ThreadDocument } from "src/threads/schemas/thread.schema.";
import { ThreadsService } from "src/threads/threads.service";
import { UserDocument } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";

import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { Message, MessageDocument } from "./schemas/message.schema";
@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly usersService: UsersService,
    private readonly threadsService: ThreadsService,
  ) {}

  async create(
    createMessageDto: CreateMessageDto,
    ownerId?: string,
  ): Promise<MessageDocument> {
    const thread = await this.findThreadById(createMessageDto.threadId);

    const createdAt = new this.messageModel({
      text: createMessageDto.text,
      user: new mongo.ObjectId(ownerId),
      thread: thread._id,
    });

    const message = await createdAt.save();
    const withUser = await message.populate("user");
    const withUserAndThread = await withUser.populate("thread");
    return withUserAndThread;
  }

  async findAll(): Promise<MessageDocument[]> {
    const messages = await this.messageModel
      .find()
      .populate("user")
      .populate("thread")
      .exec();
    if (!messages) {
      return [];
    }
    return messages;
  }

  async findOne(id: string): Promise<MessageDocument> {
    this.validateObjectId(id);
    let message: MessageDocument;
    try {
      message = await this.messageModel
        .findById(id)
        .populate("user")
        .populate("thread")
        .exec();
    } catch (error) {
      throw new NotFoundException("Could not find message");
    }
    if (!message) {
      throw new NotFoundException("Could not find message");
    }
    return message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
    ownerId?: string,
  ): Promise<MessageDocument> {
    this.validateObjectId(id);
    const { text } = updateMessageDto;
    const message = await this.findOne(id);
    this.validateIsOwner(message, ownerId);

    if (text) {
      message.text = text;
    }
    const updatedMessage = await message.save();
    const withUser = await updatedMessage.populate("user");
    return await withUser.populate("thread");
  }

  async delete(id: string, ownerId?: string): Promise<MessageDocument> {
    this.validateObjectId(id);
    const message = await this.findOne(id);
    this.validateIsOwner(message, ownerId);
    return await message.delete();
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid id");
    }
  }

  private async findThreadById(id: string): Promise<ThreadDocument> {
    let thread: ThreadDocument;
    try {
      thread = await this.threadsService.findOne(id);
    } catch (error) {
      throw new BadRequestException("Could not find thread");
    }
    if (!thread) {
      throw new BadRequestException("Could not find thread");
    }
    return thread;
  }

  private async findUserById(id: string): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.usersService.findById(id);
    } catch (error) {
      throw new BadRequestException("Could not find user");
    }
    if (!user) {
      throw new BadRequestException("Could not find user");
    }
    return user;
  }

  private validateIsOwner(message: MessageDocument, ownerId?: string) {
    const messageOwnerId = message.user._id.toString();
    if (messageOwnerId !== ownerId) {
      throw new ForbiddenException("Could not edit its message, it's not your");
    }
  }

  serialize(doc: MessageDocument): Record<string, any> {
    return classToPlain(plainToClass(Message, doc.toObject()));
  }
}
