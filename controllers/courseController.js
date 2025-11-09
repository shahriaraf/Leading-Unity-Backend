const Course = require('../models/courseModel');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error while fetching courses' });
    }
};

const createCourse = async (req, res) => {
    try {
        const { courseCode, courseTitle } = req.body;

        const courseExists = await Course.findOne({ courseCode });
        if (courseExists) {
            return res.status(400).json({ message: 'Course with this code already exists' });
        }

        const course = new Course({ courseCode, courseTitle });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Server error while creating course' });
    }
};

// --- UPDATED FUNCTION ---
const updateCourse = async (req, res) => {
    try {
        const { courseCode, courseTitle } = req.body;
        const course = await Course.findById(req.params.id);

        if (course) {
            course.courseCode = courseCode;
            course.courseTitle = courseTitle;
            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Server error while updating course' });
    }
};
// --- END OF UPDATED FUNCTION ---

// --- THIS IS THE FIXED FUNCTION ---
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (course) {
            res.json({ message: "Course removed" });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Server error while deleting course' });
    }
};
// --- END OF FIXED FUNCTION ---

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };