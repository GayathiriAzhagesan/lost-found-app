const Notification = require('../models/Notification');

// @desc    Get notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.isRead).length,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving notifications' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    if (id === 'all') {
      await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
      return res.status(200).json({ success: true, message: 'All notifications marked as read' });
    }

    const notif = await Notification.findById(id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notif.user !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating notification' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
};
