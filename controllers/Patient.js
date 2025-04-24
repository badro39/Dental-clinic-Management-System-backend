//models
import { Patient } from '../models/user.js';

export const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().select('-password ');
    if (patients.length == 0)
      return res.status(404).json({ error: 'No Patients Found!' });
    return res.status(200).json({ patients });
  } catch (err) {
    next(err);
  }
};

export const addPatient = async (req, res, next) => {
  const { firstName, lastName, email, password, birthDate, address, tel } =
    req.sanitizedBody;

  try {
    const newPatient = await Patient({
      firstName,
      lastName,
      email,
      password,
      birthDate,
      address,
      tel,
    });

    const savedPatient = await newPatient.addPatient();

    return res.status(200).json({ message: 'Patient added', savedPatient });
  } catch (err) {
    next(err);
  }
};

export const modifyPatient = async (req, res, next) => {
  const {
    patientId,
    firstName,
    lastName,
    email,
    password,
    birthDate,
    address,
    tel,
  } = req.sanitizedBody;
  try {
    await Patient.modifyPatient(patientId, {
      firstName,
      lastName,
      email,
      password,
      birthDate,
      address,
      tel,
    });
    return res.status(200).json({ message: 'Patient updated' });
  } catch (err) {
    next(err);
  }
};
