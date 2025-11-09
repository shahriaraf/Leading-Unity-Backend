const mongoose = require('mongoose');

const proposalSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId, // This links the proposal to a user
    required: true,
    ref: 'User', // The 'ref' tells Mongoose which model to link to
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const Proposal = mongoose.model('Proposal', proposalSchema);
module.exports = Proposal;