import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    courseNumber: {
      type: String,
      required: [true, 'Course number is required'],
      unique: true,
      trim: true,
      uppercase: true, // "csci 101" and "CSCI 101" count as the same course
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    subjectArea: {
      type: String,
      required: [true, 'Subject area is required'],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      cast: 'Credits must be a number',
      validate: {
        validator: (value) => value > 0,
        message: 'Credits must be greater than zero',
      },
    },
    // The teacher who created the course. Always set by the server from the
    // signed-in user, never from the request body.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Course owner is required'],
    },
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
