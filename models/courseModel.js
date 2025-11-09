const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseTitle: { type: String, required: true },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;