import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isValidCsrfToken } from '../utils/csrf.js';

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

// Reads the JWT from the HTTP-only cookie and attaches the user to req.user
export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Not signed in' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Session expired or invalid, please sign in again' });
  }

  // Requests that change data must also prove they came from our client (see utils/csrf.js)
  if (!SAFE_METHODS.includes(req.method) && !isValidCsrfToken(token, req.get('X-CSRF-Token'))) {
    return res.status(403).json({ message: 'Security check failed, please refresh the page and try again' });
  }

  const user = await User.findById(payload.id);
  if (!user) {
    return res.status(401).json({ message: 'User no longer exists' });
  }

  req.user = user;
  next();
};

// Allows the request only if the signed-in user has one of the given roles.
// Use after protect, e.g. router.post('/', protect, authorize('teacher'), handler)
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Only ${roles.join(' or ')}s can do this` });
  }
  next();
};
