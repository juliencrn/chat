import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
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
    const owner = await this.usersService.findById(ownerId);
    if (!owner) {
      throw new BadRequestException("Could not find user provided as ownerId");
    }

    // Check is the chosen name is available
    const thread = await this.findByName(createThreadDto.name);
    if (!!thread) {
      throw new BadRequestException("This thread name is already taken");
    }

    const createdThread = new this.threadModel({
      name: createThreadDto.name,
      owner,
    });
    return await createdThread.save();
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
    const threadOwnerId = thread.owner._id.toString();
    if (!ownerId || ownerId !== threadOwnerId) {
      throw new ForbiddenException("Only the owner can update a thread");
    }
  }
}
