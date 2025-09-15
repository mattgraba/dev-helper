import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};
