import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";

import { CreateThreadDto } from "./dto/create-thread.dto";
import { UpdateThreadDto } from "./dto/update-thread.dto";
import { Thread, ThreadDocument } from "./schemas/thread.schema.";

@Injectable()
export class ThreadsService {
  constructor(
    @InjectModel(Thread.name)
    private readonly threadModel: Model<ThreadDocument>,
  ) {}

  async create(createThreadDto: CreateThreadDto): Promise<ThreadDocument> {
    const thread = new this.threadModel(createThreadDto);
    return await thread.save();
  }

  async findAll(): Promise<ThreadDocument[]> {
    const threads = await this.threadModel.find().exec();
    return threads || [];
  }

  async findOne(id: string): Promise<ThreadDocument> {
    let thread: ThreadDocument;
    try {
      thread = await this.threadModel.findById(id).exec();
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
  ): Promise<ThreadDocument> {
    this.validateObjectId(id);
    const { name } = updateThreadDto;
    const message = await this.threadModel
      .findByIdAndUpdate(id, { $set: { name } }, { new: true })
      .exec();
    return message;
  }

  async remove(id: string): Promise<boolean> {
    this.validateObjectId(id);
    const { deletedCount } = await this.threadModel
      .deleteOne({ _id: id })
      .exec();
    return !!deletedCount;
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid id");
    }
  }
}
