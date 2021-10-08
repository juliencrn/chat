import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop(String)
  username: string;

  @Prop(String)
  password: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface UserPublic extends Omit<User, 'password'> {
  id: string;
}
