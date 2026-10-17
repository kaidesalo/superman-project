import express from 'express';
import { getMyEnrollments, enroll, unenroll } from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Every schedule action requires a signed-in student
router.use(protect, authorize('student'));

router.get('/me', getMyEnrollments);
router.post('/', enroll);
router.delete('/:courseId', unenroll);

export default router;
