import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // replace with your backend URL if deployed

socket.on('connect', () => {
  console.log('Connected to server as:', socket.id);

  // Example: Create or find chat with 2 userIds
  socket.emit('create_or_find_chat', [
    '67f1c43af82b504afc0bdab1',
    '67f1c48d6a203d62e0ad7786',
  ]);

  socket.on('chat_found', (chat) => {
    const chatId = "67f6dfbc3c0f7424172c998b"
    // Example: Join a chat
    socket.emit('join_chat', chat._id); // replace with actual chatId
    // Example: Send a message
    socket.emit('send_message', {
      chatId, // replace with actual chatId
      sender: '67f1c43af82b504afc0bdab1',
      content: 'Hello from test client2!',
    });
    socket.emit("getChatMessages", chatId); // replace with actual chatId
  });
});

socket.on('receive_message', (msg) => {
  console.log('New message:', msg);
});

socket.on("receive_chatMessages"), (messages) => {
  console.log("Chat messages:", messages);
}

socket.on('error', (err) => {
  console.error('Error:', err);
});
