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
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    let user: User;
    try {
      user = await this.usersService.findById(createMessageDto.userId);
    } catch (error) {
      throw new BadRequestException('Could not find user provided as userId');
    }
    if (!user) {
      throw new BadRequestException('Could not find user provided as userId');
    }

    const createdCat = new this.messageModel({
      text: createMessageDto.text,
      user,
    });
    const message = await createdCat.save();
    return message;
  }

  async findAll(): Promise<Message[]> {
    const messages = await this.messageModel.find().populate('user').exec();
    if (!messages) {
      return [];
    }
    return messages;
  }

  async findOne(id: string): Promise<Message> {
    this.validateObjectId(id);
    let message: Message;
    try {
      message = await this.messageModel.findById(id).populate('user').exec();
    } catch (error) {
      throw new NotFoundException('Could not find message');
    }
    if (!message) {
      throw new NotFoundException('Could not find message');
    }
    return message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    this.validateObjectId(id);
    const { text } = updateMessageDto;
    const message = await this.messageModel
      .findByIdAndUpdate(id, { $set: { text } }, { new: true })
      .populate('user')
      .exec();
    return message;
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
}
