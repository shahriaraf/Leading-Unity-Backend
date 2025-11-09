const express = require('express');
const router = express.Router();
const { createProposal } = require('../controllers/proposalController');
const { protect } = require('../middleware/authMiddleware'); // We only need 'protect', not 'admin'

// Any student who is logged in can create a proposal
router.route('/').post(protect, createProposal);

module.exports = router;