import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose, Transform } from "class-transformer";
import { Document, Types } from "mongoose";

export type ThreadDocument = Thread & Document;

// TODO, messages, users, owner

@Schema()
export class Thread {
  @Transform(({ obj }) => obj._id, { toClassOnly: true })
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Expose()
  get id(): string {
    return this._id?.toString();
  }
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
