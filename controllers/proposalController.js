const Proposal = require('../models/proposalModel');

const createProposal = async (req, res) => {
  try {
    // 🟢 Extract teamMembers from body
    const { title, description, supervisorId, courseId, teamMembers } = req.body;

    if (!title || !description || !supervisorId || !courseId) {
      return res.status(400).json({ message: 'Please provide title, link, supervisor, and course.' });
    }

    const proposal = new Proposal({
      title,
      description,
      student: req.user._id,
      supervisor: supervisorId,
      course: courseId,
      // 🟢 Save the team members array (default to empty list if none provided)
      teamMembers: teamMembers || [] 
    });

    const createdProposal = await proposal.save();
    res.status(201).json(createdProposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ message: 'Server error while creating proposal' });
  }
};

module.exports = { createProposal };