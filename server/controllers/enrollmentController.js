import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// The student always comes from req.user (the signed-in user), never from the request body.

// GET /api/enrollments/me
export const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate('course')
    .sort({ createdAt: 1 });

  res.json(enrollments);
};

// POST /api/enrollments  { "courseId": "..." }
export const enroll = async (req, res) => {
  const { courseId } = req.body || {};
  if (!courseId || !mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({
      message: 'A valid courseId is required',
      errors: { courseId: 'A valid courseId is required' },
    });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const alreadyEnrolled = {
    message: `${course.courseNumber} is already in your schedule`,
  };

  if (await Enrollment.exists({ student: req.user._id, course: course._id })) {
    return res.status(409).json(alreadyEnrolled);
  }

  let enrollment;
  try {
    enrollment = await Enrollment.create({ student: req.user._id, course: course._id });
  } catch (err) {
    // Two requests at the same time: the unique index stops the second one
    if (err.code === 11000) return res.status(409).json(alreadyEnrolled);
    throw err;
  }

  // If a teacher deleted the course while this request was running, undo the enrollment
  if (!(await Course.exists({ _id: course._id }))) {
    await enrollment.deleteOne();
    return res.status(404).json({ message: 'Course not found' });
  }

  await enrollment.populate('course');
  res.status(201).json(enrollment);
};

// DELETE /api/enrollments/:courseId
// Deletes only the Enrollment; the Course is not touched.
export const unenroll = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: `Invalid id: ${courseId}` });
  }

  const enrollment = await Enrollment.findOneAndDelete({
    student: req.user._id,
    course: courseId,
  });
  if (!enrollment) {
    return res.status(404).json({ message: 'This course is not in your schedule' });
  }

  res.json({ message: 'Course removed from your schedule', courseId });
};
