import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Message, MessageSchema } from './entity/message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}