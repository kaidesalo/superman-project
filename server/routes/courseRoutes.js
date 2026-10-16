import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.route('/').get(getCourses).post(createCourse);

router
  .route('/:id')
  .all(validateObjectId)
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;
