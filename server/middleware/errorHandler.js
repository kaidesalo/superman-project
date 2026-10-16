// Converts errors thrown in controllers into consistent JSON responses.
// Express 5 forwards errors from async route handlers here automatically.
const errorHandler = (err, req, res, next) => {
  // Schema validation failed (missing fields, credits <= 0, ...)
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const [field, detail] of Object.entries(err.errors)) {
      errors[field] = detail.message;
    }
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  // Unique index violation (e.g. duplicate courseNumber)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      message: `A record with this ${field} already exists`,
      errors: { [field]: `${err.keyValue?.[field]} is already in use` },
    });
  }

  // Value could not be converted to the right type (e.g. bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }

  console.error(err);
  res.status(err.status || 500).json({ message: 'Server error' });
};

export default errorHandler;
