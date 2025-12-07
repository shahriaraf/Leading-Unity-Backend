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



const getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({})
      .populate('student', 'name studentId email') // Get Leader details
      .populate('supervisor', 'name email')        // Get Supervisor details
      .populate('course', 'courseCode courseTitle') // Get Course details
      .sort({ createdAt: -1 }); // Newest first

    res.json(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



const updateProposalStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const proposal = await Proposal.findById(req.params.id);

        if (proposal) {
            proposal.status = status;
            const updatedProposal = await proposal.save();
            res.json(updatedProposal);
        } else {
            res.status(404).json({ message: 'Proposal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { createProposal, getAllProposals, updateProposalStatus };