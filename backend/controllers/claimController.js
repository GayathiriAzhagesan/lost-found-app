const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { isNonEmptyString } = require('../utils/validation');

// @desc    Submit a claim for a found or lost item
// @route   POST /api/claims
// @access  Private
const createClaim = async (req, res) => {
  try {
    const { itemId, message, proofImage } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required' });
    }
    if (!isNonEmptyString(message)) {
      return res.status(400).json({ success: false, message: 'Please provide proof or description details in your claim message' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Target item not found' });
    }

    // Prevent reporting user from claiming their own item
    const reporterId = item.reporter ? item.reporter._id : null;
    if (reporterId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot claim an item you reported' });
    }

    const claim = await Claim.create({
      item: item._id.toString(),
      itemDetails: {
        title: item.title,
        type: item.type,
        category: item.category,
        location: item.location,
        image: item.image,
      },
      claimant: {
        _id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
      },
      message: message.trim(),
      proofImage: proofImage || null,
      status: 'pending',
    });

    // Notify item reporter that a claim was submitted
    if (item.reporter && item.reporter._id) {
      await Notification.create({
        user: item.reporter._id.toString(),
        title: 'New Claim Received',
        message: `${req.user.name} submitted a claim for "${item.title}". Check your claims to review.`,
        type: 'new_claim',
        relatedItem: item._id.toString(),
      });
    }

    // Notify claimant
    await Notification.create({
      user: req.user._id.toString(),
      title: 'Claim Submitted',
      message: `Your claim for "${item.title}" is submitted and pending review.`,
      type: 'claim_submitted',
      relatedItem: item._id.toString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      data: claim,
    });
  } catch (error) {
    console.error('Create Claim Error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting claim' });
  }
};

// @desc    Get all claims (optionally filtered by item or claimant)
// @route   GET /api/claims
// @access  Private
const getClaims = async (req, res) => {
  try {
    const { item, status, myClaims } = req.query;
    let query = {};

    if (item) query.item = item;
    if (status) query.status = status;

    // If user is not admin, or user requested their own claims
    if (myClaims === 'true' || req.user.role !== 'admin') {
      query['claimant._id'] = req.user._id.toString();
    }

    const claims = await Claim.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving claims' });
  }
};

// @desc    Get claim by ID
// @route   GET /api/claims/:id
// @access  Private
const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Allow claimant, item reporter, or admin
    const claimantId = claim.claimant ? claim.claimant._id : null;
    if (
      claimantId !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this claim' });
    }

    return res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving claim' });
  }
};

// @desc    Update claim status (Approve / Reject)
// @route   PUT /api/claims/:id
// @access  Private
const updateClaimStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid claim status' });
    }

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    // Retrieve related item to verify ownership or admin role
    const item = await Item.findById(claim.item);
    const isReporter = item && item.reporter && item.reporter._id === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isReporter && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only the reporter or an administrator can resolve this claim' });
    }

    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes: adminNotes || claim.adminNotes,
      },
      { new: true }
    );

    // If claim approved, mark item as recovered/claimed
    if (status === 'approved' && item) {
      await Item.findByIdAndUpdate(item._id, { status: 'recovered' }, { new: true });
    }

    // Notify claimant of status change
    if (claim.claimant && claim.claimant._id) {
      await Notification.create({
        user: claim.claimant._id.toString(),
        title: status === 'approved' ? '🎉 Claim Approved!' : 'Claim Status Update',
        message: status === 'approved'
          ? `Your claim for "${claim.itemDetails ? claim.itemDetails.title : 'item'}" was approved! Please coordinate collection.`
          : `Your claim for "${claim.itemDetails ? claim.itemDetails.title : 'item'}" was rejected.`,
        type: status === 'approved' ? 'claim_approved' : 'claim_rejected',
        relatedItem: claim.item ? claim.item.toString() : null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Claim ${status} successfully`,
      data: updatedClaim,
    });
  } catch (error) {
    console.error('Update Claim Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating claim status' });
  }
};

// @desc    Delete claim
// @route   DELETE /api/claims/:id
// @access  Private
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    const claimantId = claim.claimant ? claim.claimant._id : null;
    if (claimantId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this claim' });
    }

    await Claim.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Claim cancelled successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error deleting claim' });
  }
};

module.exports = {
  createClaim,
  getClaims,
  getClaimById,
  updateClaimStatus,
  deleteClaim,
};
