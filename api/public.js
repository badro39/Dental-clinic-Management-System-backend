// express
import express from 'express';

//express validator
import { check } from 'express-validator';

// bcrypt
import bcrypt from 'bcrypt';

// jsonwebtoken
import jwt from 'jsonwebtoken';

// models
import { User } from '../models/user.js';

// services
import { sendEmail } from '../services/sendEmail.js';

// Controllers
import { addAnonymousAppointment } from '../controllers/Appointment.js';

const router = express.Router();
const minLength = 10;

router.get('/confirmation', async (req, res, next) => {
  try {
    const { token } = req.sanitizedQuery;
    const decode = jwt.verify(token, process.env.JWT_KEY);
    if (!decode)
      return res.status(400).json({ error: 'Invalid or expired token' });
    return res.status(200).json({ status: true });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/signin',
  [
    check('email', 'Invalid Credential').isEmail(),
    check('password', `Invalid Credential`).isLength({
      min: minLength,
    }),
  ],
  async (req, res, next) => {
    const { email, password } = req.sanitizedBody;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ err: 'Invalid credentials!' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ err: 'Invalid credentials!' });
      const token = jwt.sign(
        { id: user.id, email, role: user.role },
        process.env.JWT_KEY,
        {
          expiresIn: '15min',
        },
      );
      return res
        .cookie('token', token, {
          maxAge: 60 * 15 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'prod',
          sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
        })
        .status(200)
        .json({ message: 'Login successful' });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/signup',
  [
    check('firstName', 'First Name is required').notEmpty(),
    check('lastName', 'Last Name is required').notEmpty(),
    check('email', 'Invalid Credential').isEmail(),
    check('password', `Password min length is ${minLength}`).isLength({
      min: minLength,
    }),
  ],
  async (req, res, next) => {
    const { firstName, lastName, email, password } = req.sanitizedBody;

    try {
      // salt
      const salt = await bcrypt.genSalt(10);

      // hashing
      const hashedPassword = await bcrypt.hash(password, salt);

      // adding new user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      if (!user) return res.status(404).json({ err: 'Error while signup' });
      // generate a token
      const token = jwt.sign({ id: user.id, email }, process.env.JWT_KEY, {
        expiresIn: '15min',
      });

      const url = `${process.env.URL}/confirmation?token=${token}`;
      sendEmail(
        'Account verification',
        email,
        `verify your token by clicking on this url : <a href=${url}>${url}</a>`,
      );
      return res
        .status(201)
        .json({ status: true, message: 'Account created Successfully!' });
    } catch (err) {
      next(err);
    }
  },
);

router.post('/signout', async (req, res, next) => {
  try {
    return res
      .clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: process.env.NODE_ENV === 'prod' ? 'none' : 'lax',
      })
      .status(200)
      .json({ message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/Appointment',
  [
    check('date', 'Invalid date').isDate(),
    check('patientInfo', 'Patient info is required').notEmpty(),
    check('patientInfo.firstName', 'First Name is required').notEmpty(),
    check('patientInfo.lastName', 'Last Name is required').notEmpty(),
    check('patientInfo.email', 'Invalid Credential').isEmail(),
    check(
      'patientInfo.password',
      `Password min length is ${minLength}`,
    ).isLength({
      min: minLength,
    }),
    check('dentistId', 'Add Dentist').notEmpty(),
  ],
  addAnonymousAppointment,
);


export default router;
