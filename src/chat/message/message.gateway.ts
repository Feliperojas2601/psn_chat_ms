import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
//import * as socketio_jwt from 'socketio-jwt';
import { Server, Socket } from 'socket.io';

import { ConfigurationService } from 'src/configuration/configuration.service';
import { MessageService } from './message.service';

import { Message } from './entity/message.entity';
import { CreateMessageDto } from './DTO/createMessage.dto';
import { DeleteMessageDto } from './DTO/deleteMessage.dto';
import { GetMessagesByConversationDto } from './DTO/getMessagesByConversation.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat/message',
  secure: true,
})
export class MessageSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private configurationService: ConfigurationService,
    private messageService: MessageService,
  ) {}
  afterInit() {
    console.log('Init');
  }

  /*afterInit(): void {
    this.server.use(
      socketio_jwt.authorize({
        secret: this.config_service.get<string>('JWT_SECRET'),
        handshake: true,
      }),
    );
  }*/

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('CREATE_MESSAGE')
  public async handleCreateMessage(
    client: Socket,
    createMessageDto: CreateMessageDto,
  ) {
    try {
      const message: Message = await this.messageService.createMessage(
        createMessageDto,
      );
      this.server.to(message.conversationId).emit('CREATED_MESSAGE', message);
    } catch (e) {
      console.error(e.stack);
    }
  }

  @SubscribeMessage('DELETE_MESSAGE')
  public async handleDeleteMessage(
    client: Socket,
    deleteMessageDto: DeleteMessageDto,
  ) {
    try {
      const message: Message = await this.messageService.deleteMessage(
        deleteMessageDto,
      );
      this.server.to(message.conversationId).emit('DELETED_MESSAGE', message);
    } catch (e) {
      console.error(e.stack);
    }
  }

  @SubscribeMessage('JOIN_CONVERSATION')
  public handleJoinConversation(
    client: Socket,
    getMessagesByConversationDto: GetMessagesByConversationDto,
  ) {
    client.join(getMessagesByConversationDto.conversationId);
  }

  @SubscribeMessage('LEAVE_CONVERSATION')
  public handleLeaveConversation(
    client: Socket,
    getMessagesByConversationDto: GetMessagesByConversationDto,
  ) {
    client.leave(getMessagesByConversationDto.conversationId);
  }
}
