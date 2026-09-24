const express = require('express');
const router = express.Router();
const {
  createClaim,
  getClaims,
  getClaimById,
  updateClaimStatus,
  deleteClaim,
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All claim operations require authentication

router.route('/')
  .post(createClaim)
  .get(getClaims);

router.route('/:id')
  .get(getClaimById)
  .put(updateClaimStatus)
  .delete(deleteClaim);

module.exports = router;
