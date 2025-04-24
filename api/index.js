//express
import express from 'express';

// middleware
import { authorize } from '../middleware/auth.js';

// express validator
import { check, validationResult } from 'express-validator';

// Controllers
import {
  addAppointment,
  deleteAppointment,
  modifyAppointment,
} from '../controllers/Appointment.js';
import {
  addNotification,
  getAllNotifications,
} from '../controllers/Notification.js';
import {
  addPatient,
  getPatients,
  modifyPatient,
} from '../controllers/Patient.js';
import { getProfile, modifyProfile } from '../controllers/Profile.js';
import { AddTreatment, getAllTreatments } from '../controllers/Treatment.js';
import {
  addUser,
  deleteUser,
  getAllUsers,
  modifyUser,
} from '../controllers/User.js';

const router = express.Router();

const minLength = 10;

const checkError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array()[0].msg });
  }
  next();
};

router
  .route('/Treatment')
  .get(
    authorize(['dentist', 'assistant', 'patient']),
    [
      check('patientId', 'add patient').notEmpty(),
      check('dentistId', 'add dentist').optional().notEmpty(),
    ],
    checkError,
    getAllTreatments,
  )
  .post(
    authorize(['dentist']),
    [
      check('name', 'add treatment name').notEmpty(),
      check('startDate', 'Invalid Date').isDate(),
      check('endDate', 'Invalid Date').isDate(),
      check('patientId', 'add patient').notEmpty(),
    ],
    checkError,
    AddTreatment,
  );

router
  .route('/Patient')
  .all(authorize(['dentist', 'assistant']))
  .get(getPatients)
  .post(
    [
      check('firstName', 'add first name').notEmpty(),
      check('lastName', 'add last name').notEmpty(),
      check('email', 'Invalid email').isEmail(),
      check(
        'password',
        `password must be at least ${minLength} characters`,
      ).isLength({
        min: minLength,
      }),
    ],
    checkError,
    addPatient,
  )
  .put(
    [
      check('patientId', 'add patient id').notEmpty(),
      check('firstName', 'add first name').notEmpty(),
      check('lastName', 'add last name').notEmpty(),
      check('email', 'Invalid email').isEmail(),
      check(
        'password',
        `password must be at least ${minLength} characters`,
      ).isLength({
        min: minLength,
      }),
    ],
    checkError,
    modifyPatient,
  );

router
  .route('/Appointment')
  .all(authorize(['dentist', 'assistant', 'patient']))
  .post(
    [
      check('date', 'Invalid Date').isDate(),
      check('patientId', 'add patient').notEmpty(),
      check('dentistId', 'add dentist').notEmpty(),
    ],
    checkError,
    addAppointment,
  )
  .put(
    [
      check('appointmentId', 'undefined appointment').notEmpty(),
      check('status', 'add appointment status').notEmpty(),
      check('date', 'Invalid Date').optional().isDate(),
    ],
    checkError,
    modifyAppointment,
  )
  .delete(
    [check('appointmentId', 'Add Appointment to delete').notEmpty()],
    checkError,
    deleteAppointment,
  );

router
  .route('/profile')
  .get(checkError, getProfile)
  .put(
    [
      check('firstName', 'add first name').notEmpty(),
      check('lastName', 'add last name').notEmpty(),
      check('email', 'Invalid email').isEmail(),
      check(
        'password',
        `password must be at least ${minLength} characters`,
      ).isLength({
        min: minLength,
      }),
    ],
    checkError,
    modifyProfile,
  );

router
  .route('/Notification')
  .all(authorize(['assistant']))
  .get(getAllNotifications)
  .post(
    [
      check('subject', 'add subject').notEmpty(),
      check('message', 'add message').notEmpty(),
      check('patientId', 'add patient').notEmpty(),
      check('sendBy', 'add sending method').notEmpty(),
    ],
    checkError,
    addNotification,
  );

router
  .route('/User')
  .all(authorize(['admin']))
  .get(getAllUsers)
  .post(
    [
      check('firstName', 'add first name').notEmpty(),
      check('lastName', 'add last name').notEmpty(),
      check('email', 'Invalid email').isEmail(),
      check(
        'password',
        `password must be at least ${minLength} characters`,
      ).isLength({
        min: minLength,
      }),
      check('role', 'add user role').notEmpty(),
    ],
    checkError,
    addUser,
  )
  .put(
    [
      check('userId', 'add user id').notEmpty(),
      check('firstName', 'add first name').notEmpty(),
      check('lastName', 'add last name').notEmpty(),
      check('email', 'Invalid email').isEmail(),
      check(
        'password',
        `password must be at least ${minLength} characters`,
      ).isLength({
        min: minLength,
      }),
      check('role', 'add user role').notEmpty(),
    ],
    checkError,
    modifyUser,
  )
  .delete(
    [check('userId', 'add user to delete').notEmpty()],
    checkError,
    deleteUser,
  );

export default router;
