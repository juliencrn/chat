import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose, Transform, Type } from "class-transformer";
import { Document, Types } from "mongoose";
import { Thread } from "src/threads/schemas/thread.schema.";
import { User } from "src/users/schemas/user.schema";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Transform(({ obj }) => obj._id, { toClassOnly: true })
  _id: Types.ObjectId;

  @Prop()
  text: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Thread.name, required: true })
  @Type(() => Thread)
  thread: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Expose()
  get id(): string {
    return this._id?.toString();
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message);
