import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WebsocketFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient<Socket>();
    socket.emit('exception', exception.getError());
  }
}
