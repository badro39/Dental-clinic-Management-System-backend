import { Server } from 'socket.io';

import chatHandler from '../handlers/chatHandler.js';
import messageHandler from '../handlers/messageHandler.js';

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: process.env.URL },
  });
  server.listen(process.env.PORT || 8000);
  // Create or Find a Chat (for one-on-one or group)
  io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    chatHandler(io, socket);
    messageHandler(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });
}
