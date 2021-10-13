import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose, Transform, Type } from "class-transformer";
import { Document, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type ThreadDocument = Thread & Document;

// TODO, messages, users

@Schema()
export class Thread {
  @Transform(({ obj }) => obj._id, { toClassOnly: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  @Type(() => User)
  owner: Types.ObjectId;

  @Expose()
  get id(): string {
    return this._id?.toString();
  }
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
