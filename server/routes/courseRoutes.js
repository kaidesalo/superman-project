import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import validateObjectId from '../middleware/validateObjectId.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Anyone can view courses; only signed-in teachers can change them.
// Ownership (teachers may only edit/delete their own courses) is checked in the controller.
const teacherOnly = [protect, authorize('teacher')];

router.route('/').get(getCourses).post(teacherOnly, createCourse);

router
  .route('/:id')
  .all(validateObjectId)
  .get(getCourseById)
  .put(teacherOnly, updateCourse)
  .delete(teacherOnly, deleteCourse);

export default router;
