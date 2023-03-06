import { Module } from '@nestjs/common';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [ConversationModule, MessageModule],
  controllers: [ChatController],
})
export class ChatModule {}
