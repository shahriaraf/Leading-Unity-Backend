const Proposal = require('../models/proposalModel');

// @desc    Create a new proposal
// @route   POST /api/proposals
// @access  Private (Student only)
const createProposal = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide a title and description' });
    }

    const proposal = new Proposal({
      title,
      description,
      student: req.user._id, // Get the student's ID from the authenticated token
    });

    const createdProposal = await proposal.save();
    res.status(201).json(createdProposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ message: 'Server error while creating proposal' });
  }
};

module.exports = { createProposal };