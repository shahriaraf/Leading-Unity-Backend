const mongoose = require('mongoose');

const proposalSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // This stores the Drive Link
  
  // The student who submitted the proposal (Leader)
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  
  supervisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Course' 
  },

  // 🟢 NEW: Array to store team member details
  teamMembers: [{
    name: String,
    studentId: String,
    cgpa: String,
    email: String,
    mobile: String
  }],

  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const Proposal = mongoose.model('Proposal', proposalSchema);
module.exports = Proposal;