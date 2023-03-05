import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({
    required: [true, 'Message user id is required'],
  })
  userId: number;

  @Prop({
    required: [true, 'Message content is required'],
  })
  content: string;

  @Prop({
    required: [true, 'Message date is required'],
    default: Date.now,
  })
  createDate: Date;

  @Prop()
  updateDate: Date;

  @Prop({
    default: true,
  })
  active: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
