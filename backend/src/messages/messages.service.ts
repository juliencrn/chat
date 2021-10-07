import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    this.validateDTO(createMessageDto);
    const createdCat = new this.messageModel(createMessageDto);
    return createdCat.save();
  }

  async findAll(): Promise<Message[]> {
    return await this.messageModel.find().exec();
  }

  async findOne(id: string): Promise<Message> {
    this.validateObjectId(id);
    let message: Message;
    try {
      message = await this.messageModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find message');
    }
    if (!message) {
      throw new NotFoundException('Could not find message');
    }
    return message as Message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    this.validateObjectId(id);
    return await this.messageModel
      .findByIdAndUpdate(id, { $set: { ...updateMessageDto } }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    this.validateObjectId(id);
    const { deletedCount } = await this.messageModel
      .deleteOne({ _id: id })
      .exec();

    return !!deletedCount;
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
  }

  private validateDTO(dto: CreateMessageDto | UpdateMessageDto) {
    if (dto['_id']) {
      throw new BadRequestException("You can't override the id (_id)");
    }
  }
}
