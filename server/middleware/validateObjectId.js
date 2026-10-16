import mongoose from 'mongoose';

// Rejects malformed MongoDB ids (e.g. /api/courses/abc) before they reach a query
const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: `Invalid id: ${req.params.id}` });
  }
  next();
};

export default validateObjectId;
