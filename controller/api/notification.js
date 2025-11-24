const Notification = require("../../models/notification");

module.exports.getNotifications = async (req, res) => {
      try {
            const notifications = await Notification.find({ recipient: req.user._id })
                  .sort({ createdAt: -1 })
                  .populate('sender', 'username profilePicture');
            res.status(200).json(notifications);
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.markAsRead = async (req, res) => {
      try {
            const { id } = req.params;
            await Notification.findByIdAndUpdate(id, { read: true });
            res.status(200).json({ message: "Marked as read" });
      } catch (err) {
            res.status(500).json({ error: err.message });
      }
};

module.exports.createNotification = async (recipientId, senderId, type, message, relatedId) => {
      try {
            const notification = new Notification({
                  recipient: recipientId,
                  sender: senderId,
                  type,
                  message,
                  relatedId
            });
            await notification.save();
      } catch (err) {
            console.error("Error creating notification:", err);
      }
};
