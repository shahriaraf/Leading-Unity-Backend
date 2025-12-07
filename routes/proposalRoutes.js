const express = require('express');
const router = express.Router();
const { createProposal, getAllProposals, updateProposalStatus } = require('../controllers/proposalController');
const { protect, admin } = require('../middleware/authMiddleware'); 

// 1. Routes for the base path '/'
router.route('/')
  .post(protect, createProposal)        // Student creates
  .get(protect, admin, getAllProposals); // Admin views all (Added .get here)

// 2. Routes for specific IDs '/:id'
// We need '/:id' here so the controller knows WHICH proposal to update
router.route('/:id')
  .put(protect, admin, updateProposalStatus);

module.exports = router;