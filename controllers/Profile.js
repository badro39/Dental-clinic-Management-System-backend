//models
import {User} from '../models/user.js';

//bcrypt
import bcrypt from 'bcrypt';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ err: 'user not found' });
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const modifyProfile = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.sanitizedBody;
  try {
    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ err: 'user not found' });

    // generate salt
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashPassword = await bcrypt.hash(password, salt);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: 'user updated' });
  } catch (err) {
    next(err);
  }
};
