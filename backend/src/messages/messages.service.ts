import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import to from "await-to-js";
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

    const createdMessage = new this.messageModel({
      text: createMessageDto.text,
      user: new mongo.ObjectId(ownerId),
      thread: thread._id,
    });

    const message = await createdMessage.save();
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

  async findAllByThread(threadIds: string[]): Promise<MessageDocument[]> {
    const [error, messages] = await to(
      this.messageModel
        .find()
        .where("thread")
        .in(threadIds.map(id => new mongo.ObjectId(id)))
        .populate("user")
        .populate("thread")
        .exec(),
    );

    if (error || !messages) {
      return [];
    }
    return messages;
  }

  async findOne(id: string): Promise<MessageDocument> {
    this.validateObjectId(id);

    const [error, message] = await to(
      this.messageModel.findById(id).populate("user").populate("thread").exec(),
    );

    if (error || !message) {
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
    const [err, thread] = await to(this.threadsService.findOne(id));

    if (!thread || err) {
      throw new BadRequestException("Could not find thread");
    }

    return thread;
  }

  private async findUserById(id: string): Promise<UserDocument> {
    const [err, user] = await to(this.usersService.findById(id));

    if (!user || err) {
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
