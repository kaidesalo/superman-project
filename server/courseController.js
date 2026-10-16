import Course from '../models/Course.js';

// Only these fields can be set from a request body (createdBy is set by the server)
const COURSE_FIELDS = ['courseName', 'courseNumber', 'description', 'subjectArea', 'credits'];

const pickCourseFields = (body = {}) => {
  const data = {};
  for (const field of COURSE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};

// GET /api/courses
export const getCourses = async (req, res) => {
  const courses = await Course.find().sort({ courseNumber: 1 });
  res.json(courses);
};

// GET /api/courses/:id
export const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
};

// POST /api/courses
export const createCourse = async (req, res) => {
  const course = await Course.create(pickCourseFields(req.body));
  res.status(201).json(course);
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  course.set(pickCourseFields(req.body));
  await course.save(); // runs schema validation
  res.json(course);
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json({ message: 'Course deleted', id: course._id });
};
