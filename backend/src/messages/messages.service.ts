import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import {
  Message,
  MessageDocument,
  MessagePublic,
} from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessagePublic> {
    this.validateDTO(createMessageDto);
    const createdCat = new this.messageModel(createMessageDto);
    const message = await createdCat.save();
    return this.toPublic(message);
  }

  async findAll(): Promise<MessagePublic[]> {
    const messages = await this.messageModel.find().exec();
    if (!messages || messages.length < 1) {
      return [];
    }
    return messages.map((message) => this.toPublic(message));
  }

  async findOne(id: string): Promise<MessagePublic> {
    this.validateObjectId(id);
    let message: MessageDocument;
    try {
      message = await this.messageModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find message');
    }
    if (!message) {
      throw new NotFoundException('Could not find message');
    }
    return this.toPublic(message);
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessagePublic> {
    this.validateObjectId(id);
    const message = await this.messageModel
      .findByIdAndUpdate(id, { $set: { ...updateMessageDto } }, { new: true })
      .exec();
    return this.toPublic(message);
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

  private toPublic(message: MessageDocument): MessagePublic {
    const { _id: id, userId, text, createdAt } = message;
    return { id, userId, text, createdAt };
  }
}
