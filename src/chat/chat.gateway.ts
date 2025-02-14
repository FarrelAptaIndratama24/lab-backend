import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/socket.io',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private users = new Map<string, { username: string; room: string }>();

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(socket: Socket) {
    console.log(`User connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`User disconnected: ${socket.id}`);
    const user = this.users.get(socket.id);
    if (user) {
      this.users.delete(socket.id);
      this.updateUserList(user.room);
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room: string },
  ) {
    if (!payload.username || !payload.room) return;

    client.join(payload.room);
    this.users.set(client.id, {
      username: payload.username,
      room: payload.room,
    });

    console.log(`${payload.username} joined room: ${payload.room}`);
    this.updateUserList(payload.room);

    this.server.to(payload.room).emit('room-message', {
      username: 'System',
      message: `${payload.username} has joined the room.`,
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room: string },
  ) {
    client.leave(payload.room);
    this.users.delete(client.id);

    console.log(`${payload.username} left room: ${payload.room}`);
    this.updateUserList(payload.room);

    this.server.to(payload.room).emit('room-message', {
      username: 'System',
      message: `${payload.username} has left the room.`,
    });
  }

  @SubscribeMessage('chat-room')
  handleRoomMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room: string; message: string },
  ) {
    if (!payload.message.trim()) return;

    console.log(
      `Message from ${payload.username} in room ${payload.room}: ${payload.message}`,
    );

    // Kirim ke semua user dalam room
    this.server.to(payload.room).emit('room-message', {
      username: payload.username,
      message: payload.message,
    });
  }

  @SubscribeMessage('chat-image')
  handleImageMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { username: string; room: string; image: string },
  ) {
    console.log(`Image from ${payload.username} in room ${payload.room}`);

    this.server.to(payload.room).emit('room-image', {
      username: payload.username,
      image: payload.image,
    });
  }

  @SubscribeMessage('chat-file')
  handleFileMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { username: string; room: string; file: string; fileName: string },
  ) {
    console.log(
      `File from ${payload.username} in room ${payload.room}: ${payload.fileName}`,
    );

    this.server.to(payload.room).emit('room-file', {
      username: payload.username,
      file: payload.file,
      fileName: payload.fileName,
    });
  }

  private updateUserList(room: string) {
    const usersInRoom = Array.from(this.users.values()).filter(
      (user) => user.room === room,
    );
    this.server.to(room).emit('update-user-list', usersInRoom);
  }
}
