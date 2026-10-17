import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// Only these fields can be set from a request body (createdBy is set by the server)
const COURSE_FIELDS = ['courseName', 'courseNumber', 'description', 'subjectArea', 'credits'];

const pickCourseFields = (body = {}) => {
  const data = {};
  for (const field of COURSE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};

const isOwner = (course, user) => Boolean(course.createdBy) && course.createdBy.equals(user._id);

const NOT_OWNER = { message: 'You can only change courses you created' };

// Escapes characters like ( ) * + so user input is matched literally, not as a regex
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Keeps search queries short so one request can't make the database do a huge regex scan
const MAX_SEARCH_LENGTH = 100;

// GET /api/courses and GET /api/courses?search=csci
// Search is partial and case-insensitive on courseName and courseNumber.
export const getCourses = async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  if (search.length > MAX_SEARCH_LENGTH) {
    return res.status(400).json({ message: `Search must be ${MAX_SEARCH_LENGTH} characters or fewer` });
  }

  let filter = {};
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter = { $or: [{ courseName: pattern }, { courseNumber: pattern }] };
  }

  const courses = await Course.find(filter).sort({ courseNumber: 1 });
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
  const course = await Course.create({ ...pickCourseFields(req.body), createdBy: req.user._id });
  res.status(201).json(course);
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  if (!isOwner(course, req.user)) {
    return res.status(403).json(NOT_OWNER);
  }

  course.set(pickCourseFields(req.body));
  await course.save(); // runs schema validation
  res.json(course);
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  if (!isOwner(course, req.user)) {
    return res.status(403).json(NOT_OWNER);
  }

  await course.deleteOne();
  // A deleted course can't stay in anyone's schedule
  await Enrollment.deleteMany({ course: course._id });
  res.json({ message: 'Course deleted', id: course._id });
};
