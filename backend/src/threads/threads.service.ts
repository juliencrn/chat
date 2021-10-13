import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { UserDocument } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";

import { CreateThreadDto } from "./dto/create-thread.dto";
import { UpdateThreadDto } from "./dto/update-thread.dto";
import { Thread, ThreadDocument } from "./schemas/thread.schema.";

@Injectable()
export class ThreadsService {
  constructor(
    @InjectModel(Thread.name)
    private readonly threadModel: Model<ThreadDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createThreadDto: CreateThreadDto,
    ownerId?: string,
  ): Promise<ThreadDocument> {
    const owner = await this.findUserById(ownerId);
    await this.validateIfNameIsAvailable(createThreadDto.name);

    const createdThread = new this.threadModel({
      name: createThreadDto.name,
      owner: owner._id,
    });
    const thread = await createdThread.save();
    return await thread.populate("owner");
  }

  async findAll(): Promise<ThreadDocument[]> {
    const threads = await this.threadModel.find().populate("owner").exec();
    return threads || [];
  }

  async findOne(id: string): Promise<ThreadDocument> {
    this.validateObjectId(id);
    let thread: ThreadDocument;
    try {
      thread = await this.threadModel.findById(id).populate("owner").exec();
    } catch (error) {
      throw new NotFoundException("Could not find thread");
    }

    if (!thread) {
      throw new NotFoundException("Could not find thread");
    }

    return thread;
  }

  async findOneByName(name: string): Promise<ThreadDocument> {
    let thread: ThreadDocument;
    try {
      thread = await this.findByName(name);
    } catch (error) {
      throw new NotFoundException("Could not find thread");
    }

    if (!thread) {
      throw new NotFoundException("Could not find thread");
    }

    return thread;
  }

  async update(
    id: string,
    updateThreadDto: UpdateThreadDto,
    ownerId?: string,
  ): Promise<ThreadDocument> {
    const thread = await this.findOne(id);
    this.validateIsOwner(thread, ownerId);

    if (updateThreadDto.name) {
      thread.name = updateThreadDto.name;
    }

    return await thread.save();
  }

  async remove(id: string, ownerId?: string): Promise<ThreadDocument> {
    const thread = await this.findOne(id);
    this.validateIsOwner(thread, ownerId);
    return await thread.delete();
  }

  private async findByName(name: string): Promise<ThreadDocument> {
    return await this.threadModel.findOne({ name }).populate("owner").exec();
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid id");
    }
  }

  private validateIsOwner(thread: ThreadDocument, ownerId?: string) {
    if (!ownerId || ownerId !== thread.owner._id.toString()) {
      throw new ForbiddenException("Only the owner can update a thread");
    }
  }

  private async validateIfNameIsAvailable(name: string): Promise<void> {
    const thread = await this.findByName(name);
    if (!!thread) {
      throw new BadRequestException("This thread name is already taken");
    }
  }

  private async findUserById(id: string): Promise<UserDocument> {
    let user: UserDocument;
    try {
      user = await this.usersService.findById(id);
    } catch (error) {
      throw new NotFoundException("Could not find user");
    }

    if (!user) {
      throw new NotFoundException("Could not find user");
    }

    return user;
  }
}
