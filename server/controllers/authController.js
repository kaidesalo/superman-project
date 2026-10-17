import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const TOKEN_DAYS = 7;

// In production the client and API may be on different domains, which needs
// SameSite=None + Secure. Locally (localhost:5173 -> localhost:5000) Lax works.
const cookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};

const sendAuthCookie = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: `${TOKEN_DAYS}d` });
  res.cookie('token', token, { ...cookieOptions(), maxAge: TOKEN_DAYS * 24 * 60 * 60 * 1000 });
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password, role } = req.body || {};
  const user = await User.create({ name, email, password, role });
  sendAuthCookie(res, user);
  res.status(201).json(publicUser(user));
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  // Same message for unknown email and wrong password, so emails can't be probed
  if (!user || !(await user.comparePassword(String(password)))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  sendAuthCookie(res, user);
  res.json(publicUser(user));
};

// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out' });
};

// GET /api/auth/me (requires the protect middleware)
export const getMe = (req, res) => {
  res.json(publicUser(req.user));
};
