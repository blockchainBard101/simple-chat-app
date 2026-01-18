import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3003, { cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log("client connected", client.id);
    console.log(args);

    client.broadcast.emit('user-joined', {
      message: "User joined",
      id: client.id
    });
  }

  handleDisconnect(client: Socket) {
    console.log("client disconnected", client.id);

    this.server.emit('user-left', {
      message: "User left",
      id: client.id
    });
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: string) {
    console.log("handleMessage triggered");
    console.log("Client ID:", client.id);
    console.log("Message:", message);

    // client.emit('reply-message', "Hello world!");
    client.broadcast.emit('reply-message', message);
  }
}
