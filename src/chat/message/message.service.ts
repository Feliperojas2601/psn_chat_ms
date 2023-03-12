import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Conversation,
  ConversationDocument,
} from '../conversation/entity/conversation.entity';
import { Message, MessageDocument } from './entity/message.entity';

import { CreateMessageDto } from './DTO/createMessage.dto';
import { GetMessagesByConversationDto } from './DTO/getMessagesByConversation.dto';
import { DeleteMessageDto } from './DTO/deleteMessage.dto';
import { PaginationDto } from 'src/common/DTO/pagination.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const conversationContainsUser = await this.conversationModel.findOne({
        _id: createMessageDto.conversationId,
        membersId: createMessageDto.userId,
      });
      if (!conversationContainsUser) {
        throw new BadRequestException(
          'User does not belongs to the conversation',
        );
      }
      const message = await this.messageModel.create(createMessageDto);
      return message;
    } catch (error) {
      this.handleException(error);
    }
  }

  async getMessagesByConversation(
    getMessagesByConversationDto: GetMessagesByConversationDto,
    paginationDto: PaginationDto,
  ): Promise<Message[]> {
    try {
      const { limit = 50, offset = 0 } = paginationDto;
      const conversationContainsUser = await this.conversationModel.findOne({
        _id: getMessagesByConversationDto.conversationId,
        membersId: getMessagesByConversationDto.userId,
      });
      if (!conversationContainsUser) {
        throw new BadRequestException(
          'User does not belongs to the conversation',
        );
      }
      const messages = await this.messageModel
        .find({
          conversationId: getMessagesByConversationDto.conversationId,
          active: true,
        })
        .skip(offset)
        .limit(limit);
      return messages;
    } catch (error) {
      this.handleException(error);
    }
  }

  async deleteMessage(deleteMessageDto: DeleteMessageDto): Promise<Message> {
    try {
      const conversationContainsUser = await this.conversationModel.findOne({
        _id: deleteMessageDto.conversationId,
        membersId: deleteMessageDto.userId,
      });
      if (!conversationContainsUser) {
        throw new BadRequestException(
          'User does not belongs to the conversation',
        );
      }
      const messageContainsUser = await this.messageModel.findOne({
        _id: deleteMessageDto.messageId,
        membersId: deleteMessageDto.userId,
        conversationId: deleteMessageDto.conversationId,
      });
      if (!messageContainsUser) {
        throw new BadRequestException('Message does not belongs to the user');
      }
      const message = await this.messageModel.findByIdAndUpdate(
        deleteMessageDto.messageId,
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
    console.log(error);
    if (error.response.error == 'Bad Request') {
      throw new BadRequestException(error.response.message);
    }
    throw new InternalServerErrorException(
      `Unknown error, please contact server Admins`,
    );
  }
}
