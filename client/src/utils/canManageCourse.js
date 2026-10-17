// True when the user is the teacher who created this course.
// Only hides buttons in the UI; the server enforces the real rule.
export const canManageCourse = (user, course) =>
  user?.role === 'teacher' && Boolean(course?.createdBy) && course.createdBy === user._id
