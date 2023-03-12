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
      if (previousConversationMembers.length > 0) {
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

  async deleteConversationByUser(
    deleteUserFromConversationDTO: DeleteUserFromConversationDto,
  ): Promise<Conversation> {
    try {
      if (
        deleteUserFromConversationDTO.memberId !=
        deleteUserFromConversationDTO.userId
      ) {
        throw new BadRequestException(
          'User is not authorized to delete another user from conversation',
        );
      }
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
