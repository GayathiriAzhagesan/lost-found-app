const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { isNonEmptyString } = require('../utils/validation');

// @desc    Get items with search and filters
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { type, search, category, location, status, reporterId } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }
    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }
    if (location && location !== 'All') {
      filter.location = new RegExp(location.trim(), 'i');
    }
    if (status) {
      filter.status = status;
    }
    if (reporterId) {
      filter['reporter._id'] = reporterId;
    }
    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { location: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
      ];
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving items' });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving item' });
  }
};

// @desc    Report a new lost or found item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      category,
      description,
      location,
      date,
      time,
      image,
      additionalDetails,
    } = req.body;

    if (!type || !['lost', 'found'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Item type must be either "lost" or "found"' });
    }
    if (!isNonEmptyString(title)) {
      return res.status(400).json({ success: false, message: 'Item title is required' });
    }
    if (!isNonEmptyString(category)) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }
    if (!isNonEmptyString(location)) {
      return res.status(400).json({ success: false, message: 'Campus location is required' });
    }

    const newItem = await Item.create({
      type,
      title: title.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      location: location.trim(),
      date: date || new Date().toISOString().split('T')[0],
      time: time || '12:00',
      status: 'open',
      image: image || (type === 'lost' 
        ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'),
      additionalDetails: additionalDetails || '',
      reporter: {
        _id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
      },
    });

    // Notify user of report creation
    await Notification.create({
      user: req.user._id.toString(),
      title: `${type === 'lost' ? 'Lost' : 'Found'} Item Reported`,
      message: `Your report for "${newItem.title}" has been published to the campus bulletin.`,
      type: 'report_created',
      relatedItem: newItem._id.toString(),
    });

    return res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully`,
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error creating item' });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Must be reporter or admin
    const reporterId = item.reporter ? item.reporter._id : null;
    if (reporterId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this item' });
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating item' });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Must be reporter or admin
    const reporterId = item.reporter ? item.reporter._id : null;
    if (reporterId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting item' });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
