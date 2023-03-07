import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { MessageService } from './message/message.service';
import { ConversationService } from './conversation/conversation.service';

import { CreateConversationDto } from './conversation/DTO/createConversation.dto';
import { CreateMessageDto } from './message/DTO/createMessage.dto';

import { ParseMongoIdPipe } from 'src/common/pipes/parseMongoId.pipe';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  @Post('conversation')
  createConversation(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.createConversation(createConversationDto);
  }

  @Post('conversation/message')
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }

  @Get('conversation/user/:id')
  getConversationsByUser(@Param('id') id: number) {
    return this.conversationService.getConversationsByUser(id);
  }

  @Get('conversation/:conversationId/user/:userId/message')
  getMessagesByConversation(
    @Param('conversationId', ParseMongoIdPipe) conversationId: string,
    @Param('userId') userId: number,
  ) {
    return this.messageService.getMessagesByConversation({
      userId,
      conversationId,
    });
  }

  @Delete('conversation/:conversationId/user/:userId/member/:memberId')
  deleteUserFromConversation(
    @Param('conversationId', ParseMongoIdPipe) conversationId: string,
    @Param('userId') userId: number,
    @Param('memberId') memberId: number,
  ) {
    return this.conversationService.deleteUserFromConversation({
      memberId,
      conversationId,
      userId,
    });
  }

  @Delete('conversation/:conversationId/user/:userId/message/:messageId')
  deleteMessage(
    @Param('messageId', ParseMongoIdPipe) messageId: string,
    @Param('userId') userId: number,
    @Param('conversationId', ParseMongoIdPipe) conversationId: string,
  ) {
    return this.messageService.deleteMessage({
      userId,
      messageId,
      conversationId,
    });
  }
}
