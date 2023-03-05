import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConversationDto } from './DTO/createConversation.dto';
import {
  Conversation,
  ConversationDocument,
} from './entity/conversation.entity';

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
      const conversation = await this.conversationModel.create(
        createConversationDto,
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
    throw new InternalServerErrorException(
      `Unknown error, please contact server Admins`,
    );
  }
}
