import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { JwtVerifiedResult } from 'src/auth/entities/jwt.entity';
import { WebsocketFilter } from 'src/filters/websocket.filter';
import { ZodValidationWsPipe } from 'src/pipes/zod-validation-ws.pipe';
import { type MessageDto, messageSchema } from './dtos/message.dto';
import { type IOServer, type IOSocket } from './events';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@WebSocketGateway({ cookie: true })
@UseFilters(WebsocketFilter)
@UseGuards(WsJwtGuard)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: IOServer;

  afterInit(io: IOServer) {
    io.use((socket: IOSocket, next) => {
      console.log(socket.handshake.headers);
      const [type, token] =
        socket.handshake.headers.authorization?.split(' ') ?? [];
      const bearerToken = type === 'Bearer' ? token : undefined;
      if (!bearerToken) {
        return next(new Error('Empty Token!'));
      }
      try {
        const payload = this.jwtService.verify<JwtVerifiedResult>(bearerToken);
        socket.data.user = { userId: payload.userId, email: payload.email };
        next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  async handleConnection(client: IOSocket) {
    if (client.data.user?.userId) {
      await client.join(`user:${client.data.user.userId}`);
    }
    console.log('Client connected:', client.id, ' = ', client.data.user);
  }

  handleDisconnect(client: IOSocket) {
    console.log('Client disconnected:', client.id, ' = ', client.data.user);
  }

  @SubscribeMessage('newMessage')
  handleEvent(
    @MessageBody(new ZodValidationWsPipe(messageSchema)) message: MessageDto,
    @ConnectedSocket() client: IOSocket,
  ) {
    client.to(`user:${message.to}`).emit('newMessage', {
      from: client.data.user.email,
      message: message.message,
      time: new Date().toDateString(),
    });
  }
}
