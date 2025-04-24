//models
import Appointment from '../models/appointment.js';

//bcrypt
import bcrypt from 'bcrypt';

export const addAppointment = async (req, res, next) => {
  const { date, patientId, dentistId } = req.sanitizedBody;
  try {
    const appointment = await Appointment.create({
      date,
      patient: patientId,
      dentist: dentistId,
    });
    return res.status(200).json({ message: 'Appointment added', appointment });
  } catch (err) {
    next(err);
  }
};

export const modifyAppointment = async (req, res, next) => {
  const { appointmentId, status, date } = req.sanitizedBody;
  try {
    // find appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ err: 'appointment not found' });

    if (status !== 'pending') {
      // update appointment status
      if (status == 'confirmed') await Appointment.confirm();
      else await Appointment.cancel();
    }
    if (date) {
      appointment.date = date;
      await appointment.save();
    }
    return res.status(200).json({ message: 'Appointment updated' });
  } catch (err) {
    next(err);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.sanitizedBody;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ err: 'appointment not found' });
    await appointment.deleteOne();
    return res.status(200).json({ message: 'appointment deleted' });
  } catch (err) {
    next(err);
  }
};

export const addAnonymousAppointment = async (req, res, next) => {
  try {
    const { date, patientInfo, dentistId } = req.sanitizedBody;

    // create patient
    const { firstName, lastName, email, password } = patientInfo;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const patient = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // create appointment
    const appointment = await Appointment.create({
      date,
      patient: patient._id,
      dentist: dentistId,
    });
    return res.status(200).json({ message: 'Appointment added', appointment });
  } catch (err) {
    next(err);
  }
};
