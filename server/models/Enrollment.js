import mongoose from 'mongoose';

// One row per course in a student's schedule. Removing a course from a schedule
// deletes the Enrollment only; the Course stays in the catalog.
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A student can add each course to their schedule only once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
