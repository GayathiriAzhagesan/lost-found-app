const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLost = await Item.countDocuments({ type: 'lost' });
    const totalFound = await Item.countDocuments({ type: 'found' });
    const activeClaims = await Claim.countDocuments({ status: 'pending' });
    const recoveredItems = await Item.countDocuments({ status: 'recovered' });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLost,
        totalFound,
        activeClaims,
        recoveredItems,
        totalItems: totalLost + totalFound,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving statistics' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving users' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete administrator account' });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User removed successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
};

// @desc    Manage/moderate item (flag, delete, status change)
// @route   PUT /api/admin/items/:id
// @access  Private/Admin
const manageItem = async (req, res) => {
  try {
    const { status, flags } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { status, flags },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Item updated by administrator',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error moderating item' });
  }
};

module.exports = {
  getStats,
  getUsers,
  deleteUser,
  manageItem,
};
