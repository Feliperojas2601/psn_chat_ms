import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message, MessageDocument } from './entity/message.entity';
import {
  Conversation,
  ConversationDocument,
} from '../conversation/entity/conversation.entity';

import { CreateMessageDto } from './DTO/createMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const { conversationId } = createMessageDto;
      const message = await this.messageModel.create(createMessageDto);
      this.conversationModel.findByIdAndUpdate(conversationId, {
        $push: { Messages: message },
      });
      return message;
    } catch (error) {
      this.handleException(error);
    }
  }

  async deleteMessage(messageId: number): Promise<number> {
    try {
      this.messageModel.findByIdAndUpdate(messageId, {
        active: false,
        updateDate: Date.now,
      });
      return messageId;
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any): void {
    /*if (error.code === 11000) {
      throw new BadRequestException(
        `Message already exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }*/
    console.log(error);
    throw new InternalServerErrorException(
      `Unknown error, please contact server Admins`,
    );
  }
}
