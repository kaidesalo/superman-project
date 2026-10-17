// Gives courses created before login existed (no createdBy) to a teacher,
// so someone can edit or delete them.
// Usage: npm run assign-owner -- teacher@example.com
import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import User from '../models/User.js';

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run assign-owner -- teacher@example.com');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const teacher = await User.findOne({ email: email.toLowerCase().trim(), role: 'teacher' });
if (!teacher) {
  console.error(`No teacher account found for ${email}`);
  await mongoose.disconnect();
  process.exit(1);
}

const result = await Course.updateMany({ createdBy: { $exists: false } }, { createdBy: teacher._id });
console.log(`Assigned ${result.modifiedCount} course(s) to ${teacher.name} (${teacher.email})`);

await mongoose.disconnect();
