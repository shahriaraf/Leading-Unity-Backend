const Proposal = require('../models/proposalModel');

const createProposal = async (req, res) => {
  try {
    // 🟢 Extract teamMembers from body
    const { title, description, supervisorIds, courseId, teamMembers } = req.body;

    if (!title || !description || !supervisorIds || !courseId) {
      return res.status(400).json({ message: 'Please provide title, link, supervisor, and course.' });
    }

    const leaderStudentId = req.user.studentId; 
    const memberStudentIds = teamMembers ? teamMembers.map(m => m.studentId) : [];
    const allInvolvedStudentIds = [leaderStudentId, ...memberStudentIds];

    const uniqueIdsToCheck = [...new Set(allInvolvedStudentIds.filter(id => id))];

      const existingMemberConflict = await Proposal.findOne({
      'teamMembers.studentId': { $in: uniqueIdsToCheck },
      status: { $ne: 'rejected' } // Only check pending or approved proposals
    });

    if (existingMemberConflict) {
      return res.status(400).json({ 
        message: 'One or more students are already members of another team.' 
      });
    }

    // 🟢 STEP 3: Check if ANY of these students are already a 'Leader' (student field)
    // The 'student' field in Proposal is an ObjectId, but our list is Strings.
    // We must find the User ObjectIds for these Student IDs first.
    const users = await User.find({ studentId: { $in: uniqueIdsToCheck } });
    const userObjectIds = users.map(user => user._id);

    const existingLeaderConflict = await Proposal.findOne({
      student: { $in: userObjectIds },
      status: { $ne: 'rejected' }
    });

    if (existingLeaderConflict) {
      return res.status(400).json({ 
        message: 'One or more students (or the leader) are already leading another team.' 
      });
    }


    const proposal = new Proposal({
      title,
      description,
      student: req.user._id,
      supervisors: supervisorIds,
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
      .populate('supervisors', 'name email') // 🟢 Populate the array, not single field       // Get Supervisor details
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