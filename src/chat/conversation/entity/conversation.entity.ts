import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message } from 'src/chat/message/entity/message.entity';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop({
    type: [Number],
    required: [true, 'Conversations members ids are required'],
  })
  membersId: number[];

  @Prop({
    required: [true, 'Message date is required'],
    default: Date.now,
  })
  createDate: Date;

  @Prop()
  updateDate: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
