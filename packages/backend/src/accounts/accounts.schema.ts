import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  secret: string;

  @Prop({ trim: true })
  url?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// Index for fast per-user queries
AccountSchema.index({ userId: 1, name: 1 });
