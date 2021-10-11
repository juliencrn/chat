import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose, Transform } from "class-transformer";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ obj }) => obj._id, { toClassOnly: true })
  _id: Types.ObjectId;

  @Prop({ unique: true })
  username: string;

  @Prop()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: string;

  @Expose()
  get id(): string {
    return this._id?.toString();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
