import { Server, Socket } from 'socket.io';
import { MessageDto } from './dtos/message.dto';
import { Message } from './entities/message.entity';
import { LoggedInUser } from 'src/auth/entities/logged-in-user.entity';

interface ServerToClientEvents {
  newMessage: (payload: Message) => void;
}

interface ClientToServerEvents {
  newMessage: (payload: MessageDto) => void;
}

interface IOData {
  user: LoggedInUser;
}

export type IOServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  any,
  IOData
>;
export type IOSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  any,
  IOData
>;
