import Chat from '../models/chat.js';

export default function chatHandler(io, socket) {
  // Event to create a new chat or find an existing one
  socket.on('create_chat', async (userIds) => {
    try {
      if (userIds.length < 2) {
        return socket.emit('error', 'A chat requires at least 2 users');
      }

      const chat = await Chat.create({
        participants: userIds,
        isGroup: userIds.length > 2,
      });

      // Emit the chat details to the user
      socket.emit('chat_found', chat._id); // Notify all users in the chat
    } catch (err) {
      socket.emit('error', 'Error creating or finding chat');
    }
  });

  // Join a Chat (user joins an existing chat by chatId)
  socket.on('join_chat', (chatId) => {
    try {
      // socket.io join, not Array.join
      socket.join(chatId);
    } catch (err) {
      socket.emit('error', `error while join in a chat: ${err}`);
    }
  });

  //   // Add Member to Chat
  //   socket.on('add_member', async ({ chatId, userId }) => {
  //     try {
  //       const chat = await Chat.findById(chatId);
  //       if (!chat) {
  //         return socket.emit('error', 'Chat not found');
  //       }

  //       if (!chat.users.includes(userId)) {
  //         chat.users.push(userId);
  //         await chat.save();
  //         io.to(chatId).emit('member_added', userId);
  //         io.to(userId).emit('chat_found', chat); // Notify the new user
  //       }
  //     } catch (err) {
  //       socket.emit('error', 'Error adding member to chat');
  //     }
  //   });

  //   // Remove Member from Chat
  //   socket.on('remove_member', async ({ chatId, userId }) => {
  //     try {
  //       const chat = await Chat.findById(chatId);
  //       if (!chat) {
  //         return socket.emit('error', 'Chat not found');
  //       }

  //       chat.users = chat.users.filter((user) => user.toString() !== userId);
  //       await chat.save();
  //       io.to(chatId).emit('member_removed', userId);
  //       io.to(userId).emit('chat_left', chatId); // Notify the removed user
  //     } catch (err) {
  //       socket.emit('error', 'Error removing member from chat');
  //     }
  //   });
}
