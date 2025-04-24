import { Server } from 'socket.io';
import Chat from '../models/chat.js'; // Assuming you have a Chat model for storing chat data
import Message from '../models/message.js';
export default function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' },
  });
  server.listen(process.env.PORT || 8000);
  // Create or Find a Chat (for one-on-one or group)
  io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    // Event to create a new chat or find an existing one
    socket.on('create_or_find_chat', async (userIds) => {
      try {
        if (userIds.length < 2) {
          return socket.emit('error', 'A chat requires at least 2 users');
        }
        // Try to find an existing chat with the provided users
        let chat = await Chat.findOne({
          users: { $all: userIds, $size: userIds.length },
        });
        // If no chat found, create a new one
        if (!chat) {
          chat = await Chat.create({
            participants: userIds,
            isGroup: userIds.length > 2,
          });
        }

        // Emit the chat details to the user
        socket.emit('chat_found', chat);
        userIds.forEach((userId) => {
          io.to(userId).emit('chat_found', chat); // Notify all users in the chat
        });
      } catch (err) {
        socket.emit('error', 'Error creating or finding chat');
      }
    });

    // Join a Chat (user joins an existing chat by chatId)
    socket.on('join_chat', (chatId) => {
      try {
        socket.join(chatId);
        console.log(`User ${socket.id} joined chat ${chatId}`);
      } catch (err) {
        socket.emit('error', `error while join in a chat: ${err}`);
      }
    });

    // Send a Message
    socket.on('send_message', async (req) => {
      try {
        const { chatId, sender, content } = req;
        const message = await Message.create({
          content: content,
          sender: sender,
          chat: chatId,
        });
        const populatedMessage = await message.populate({
          path: 'sender chat', // You can pass multiple paths here as a space-separated string or array
          select: 'firstName lastName role name participants', // Fields for both sender and chat
        });

        // Emit the message to all users in the chat
        //io.to(chatId).emit('receive_message', populatedMessage);
        
      } catch (err) {
        socket.emit('error', `Error sending message: ${err}`);
      }
    });

    socket.on('getChatMessages', async (chatId) => {
      try {
        const messages = await Message.find({ chat: chatId }).populate(
          'sender chat',
          'firstName lastName role name participants',
        );
        console.log("chat messages: ", messages)
        //socket.emit('receive_chatMessages', messages);

      } catch (err) {
        socket.emit('error', `Error fetching messages: ${err}`);
      }
    });

    //   // Modify Message (edit the content of an existing message)
    //   socket.on('modify_message', async ({ messageId, newText }) => {
    //     try {
    //       const message = await Message.findById(messageId);
    //       if (!message) {
    //         return socket.emit('error', 'Message not found');
    //       }
    //       message.text = newText;
    //       await message.save();

    //       // Emit the updated message to all users in the chat
    //       io.to(message.chat.toString()).emit('receive_message', message);
    //     } catch (err) {
    //       socket.emit('error', 'Error modifying message');
    //     }
    //   });

    //   // Delete Message
    //   socket.on('delete_message', async (messageId) => {
    //     try {
    //       const message = await Message.findByIdAndDelete(messageId);
    //       if (!message) {
    //         return socket.emit('error', 'Message not found');
    //       }

    //       // Emit the deletion to all users in the chat
    //       io.to(message.chat.toString()).emit('message_deleted', messageId);
    //     } catch (err) {
    //       socket.emit('error', 'Error deleting message');
    //     }
    //   });

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

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });
}
