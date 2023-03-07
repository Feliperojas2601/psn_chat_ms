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
} from './entity/conversation.entity';

import { CreateConversationDto } from './DTO/createConversation.dto';
import { DeleteUserFromConversationDto } from './DTO/deleteUserFromConversation.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    try {
      const previousConversationMembers = await this.conversationModel.find({
        membersId: createConversationDto.membersId,
      });
      if (previousConversationMembers) {
        throw new BadRequestException(
          'Previous conversation with those members already exists',
        );
      }
      const conversation = await this.conversationModel.create(
        createConversationDto,
      );
      return conversation;
    } catch (error) {
      this.handleException(error);
    }
  }

  async getConversationsByUser(userId: number): Promise<Conversation[]> {
    try {
      const conversations = await this.conversationModel.find({
        membersId: userId,
      });
      return conversations;
    } catch (error) {
      this.handleException(error);
    }
  }

  async deleteUserFromConversation(
    deleteUserFromConversationDTO: DeleteUserFromConversationDto,
  ): Promise<Conversation> {
    try {
      const conversationContainsUser = await this.conversationModel.findOne({
        _id: deleteUserFromConversationDTO.conversationId,
        membersId: deleteUserFromConversationDTO.memberId,
      });
      if (!conversationContainsUser) {
        throw new BadRequestException(
          'User does not belongs to the conversation',
        );
      }
      const conversation = await this.conversationModel.findByIdAndUpdate(
        deleteUserFromConversationDTO.conversationId,
        {
          $pull: { membersId: deleteUserFromConversationDTO.memberId },
          updateDate: Date.now(),
        },
        { new: true },
      );
      return conversation;
    } catch (error) {
      this.handleException(error);
    }
  }

  // Falta el resto de funcionalidades

  private handleException(error: any): void {
    /*if (error.code === 11000) {
      throw new BadRequestException(
        `Message already exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }*/
    console.log(error);
    if (error.response.error == 'Bad Request') {
      throw new BadRequestException(error.response.message);
    }
    throw new InternalServerErrorException(
      `Unknown error, please contact server Admins`,
    );
  }
}
