import Message from '../models/message.js';
export default function messageHandler(io, socket) {
  // Send a Message
  socket.on('send_message', async (req) => {
    try {
      const { chatId, senderId, content } = req;
      const message = await Message.create({
        content,
        sender: senderId,
        chat: chatId,
      });
      const populatedMessage = await message.populate({
        path: 'sender chat', // You can pass multiple paths here as a space-separated string or array
        select: 'firstName lastName role name participants', // Fields for both sender and chat
      });

      // Emit the message to all users in the chat
      io.to(chatId.toString()).emit('receive_message', populatedMessage);
    } catch (err) {
      socket.emit('error', `Error sending message: ${err}`);
    }
  });

  socket.on('getChatMessages', async ({ chatId, userId }) => {
    try {
      const messages = await Message.find({ chat: chatId }).populate(
        'sender chat',
        'firstName lastName role name participants',
      );

      socket.emit('receive_chatMessages', messages);
      io.to(chatId).emit('user_joined', {
        joined: true,
        content: `User ${userId} has joined the chat`,
      });
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
}
