import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message, MessageDocument } from './entity/message.entity';

import { CreateMessageDto } from './DTO/createMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const message = await this.messageModel.create(createMessageDto);
      return message;
    } catch (error) {
      this.handleException(error);
    }
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    try {
      const messages = await this.messageModel.find({
        conversationId: conversationId,
        active: true,
      });
      return messages;
    } catch (error) {
      this.handleException(error);
    }
  }

  async deleteMessage(messageId: string): Promise<Message> {
    try {
      const message = await this.messageModel.findByIdAndUpdate(
        messageId,
        {
          active: false,
          updateDate: Date.now(),
        },
        { new: true },
      );
      return message;
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
