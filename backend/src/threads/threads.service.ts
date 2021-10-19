import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import to from "await-to-js";
import { isValidObjectId, Model } from "mongoose";
import slugify from "slugify";
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
      slug: this.slugify(createThreadDto.name),
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

    const [err, thread] = await to(
      this.threadModel.findById(id).populate("owner").exec(),
    );

    if (!thread || err) {
      throw new NotFoundException("Could not find thread");
    }

    return thread;
  }

  async findOneBySlug(slug: string): Promise<ThreadDocument> {
    const [err, thread] = await to(this.findBySlug(slug));

    if (!thread || err) {
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

  private async findBySlug(slug: string): Promise<ThreadDocument> {
    return await this.threadModel.findOne({ slug }).populate("owner").exec();
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
    const thread = await this.findBySlug(this.slugify(name));
    if (!!thread) {
      throw new BadRequestException("This thread name is already taken");
    }
  }

  private slugify(name: string): string {
    return slugify(name, { lower: true });
  }

  private async findUserById(id: string): Promise<UserDocument> {
    const [err, user] = await to(this.usersService.findById(id));

    if (err || !user) {
      throw new NotFoundException("Could not find user");
    }

    return user;
  }
}
