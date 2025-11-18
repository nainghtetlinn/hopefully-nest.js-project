/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UseFilters } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketFilter } from 'src/filters/websocket.filter';
import { ZodValidationWsPipe } from 'src/pipes/zod-validation-ws.pipe';
import { type MessageDto, messageSchema } from './dtos/message.dto';

@WebSocketGateway()
@UseFilters(new WebsocketFilter())
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('newMessage')
  handleEvent(
    @MessageBody(new ZodValidationWsPipe(messageSchema)) message: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(message.clientId).emit('receiveMessage', {
      from: client.id,
      message: message.message,
      time: new Date().toDateString(),
    });
  }
}
