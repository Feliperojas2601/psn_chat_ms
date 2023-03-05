import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Conversation, ConversationSchema } from './entity/conversation.entity';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
