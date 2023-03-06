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

  @Post('message')
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }

  @Get('conversation/user/:id')
  getConversationsByUser(@Param('id') id: number) {
    return this.conversationService.getConversationsByUser(id);
  }

  @Get('message/conversation/:id')
  getMessagesByConversation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.messageService.getMessagesByConversation(id);
  }

  @Delete('conversation/:conversationId/user/:userId')
  deleteUserFromConversation(
    @Param('conversationId', ParseMongoIdPipe) conversationId: string,
    @Param('userId') memberId: number,
  ) {
    return this.conversationService.deleteUserFromConversation({
      memberId,
      conversationId,
    });
  }

  @Delete('message/:id')
  deleteMessage(@Param('id', ParseMongoIdPipe) id: string) {
    return this.messageService.deleteMessage(id);
  }
}
