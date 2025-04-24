//models
import {User} from '../models/user.js';

// bcrypt
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length == 0)
      return res.status(404).json({ error: 'No Users Found!' });
    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.sanitizedBody;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(200).json({ message: 'new user added!' });
  } catch (err) {
    next(err);
  }
};

export const modifyUser = async (req, res, next) => {
  const { userId, firstName, lastName, email, password, role } = req.sanitizedBody;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.modifyUser(userId, {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(200).json({ message: 'user updated!' });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.sanitizedBody;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User Not Found!' });
    await user.deleteOne();
    return res.status(200).json({ message: 'User deleted!' });
  } catch (err) {
    next(err);
  }
};
