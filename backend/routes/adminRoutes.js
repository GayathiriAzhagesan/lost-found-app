const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  deleteUser,
  manageItem,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/items/:id', manageItem);

module.exports = router;
