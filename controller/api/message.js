const Message = require("../../models/message");
const User = require("../../models/user");
const notificationController = require("./notification");

module.exports.sendMessage = async (req, res) => {
      try {
            const { receiverId, content, listingId } = req.body;
            const senderId = req.user._id;

            const newMessage = new Message({
                  sender: senderId,
                  receiver: receiverId,
                  content,
                  listing: listingId
            });

            await newMessage.save();

            // Create notification for receiver
            await notificationController.createNotification(
                  receiverId,
                  senderId,
                  'message',
                  `New message from ${req.user.username}`,
                  newMessage._id
            );

            res.status(201).json(newMessage);
      } catch (err) {
            res.status(400).json({ error: err.message });
      }
};

module.exports.getConversation = async (req, res) => {
      try {
            const { userId } = req.params;
            const currentUserId = req.user._id;

            const messages = await Message.find({
                  $or: [
                        { sender: currentUserId, receiver: userId },
                        { sender: userId, receiver: currentUserId }
                  ]
            })
                  .sort({ createdAt: 1 })
                  .populate('sender', 'username')
                  .populate('receiver', 'username');

            res.status(200).json(messages);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.getInbox = async (req, res) => {
      try {
            const currentUserId = req.user._id;

            // Find all messages involving the current user
            const messages = await Message.find({
                  $or: [{ sender: currentUserId }, { receiver: currentUserId }]
            })
                  .sort({ createdAt: -1 })
                  .populate('sender', 'username')
                  .populate('receiver', 'username')
                  .populate('listing', 'title');

            // Group by other user to form conversations
            const conversations = {};
            messages.forEach(msg => {
                  const otherUser = msg.sender._id.equals(currentUserId) ? msg.receiver : msg.sender;
                  const otherUserId = otherUser._id.toString();

                  if (!conversations[otherUserId]) {
                        conversations[otherUserId] = {
                              user: otherUser,
                              lastMessage: msg,
                              listing: msg.listing
                        };
                  }
            });

            res.status(200).json(Object.values(conversations));
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};
