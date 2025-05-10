// models
import Notification from '../models/notification.js';
import { Patient } from '../models/user.js';

// services
import { scheduleFCM, sendFCM } from '../services/FCM.js';
import { scheduleEmail, sendEmail } from '../services/sendEmail.js';
import { scheduleSMS, sendSMS } from '../services/sendSMS.js';

export const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .populate('patient', '-password')
      .sort({ createdAt: -1 });
    if (!notifications)
      return res.status(404).json({ error: 'No Notifications Found!' });
    return res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
};

export const getNotificationByPatientId = async (req, res, next) => {
  const { patientId } = req.params;
  try {
    const notifications = await Notification.find({
      patient: patientId,
    }).populate('patient', '-password');
    if (!notifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }
    return res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

export const addNotification = async (req, res, next) => {
  const { subject, message, sendDate, patientId, sendBy, token } = req.sanitizedBody;
  try {
    const patient = await Patient.findById(patientId);
    let success;
    if (!patient)
      return res.status(404).json({ error: 'Patient Not Found!' });
    if (sendBy.includes('email')) {
      success = sendDate
        ? await scheduleEmail(subject, message, patient.email, sendDate)
            .then((result) => result)
            .catch((err) => console.error('err: ', err))
        : await sendEmail(subject, message, patient.email);
    }

    if (sendBy.includes('sms')) {
      success = sendDate
        ? await scheduleSMS(message, patient.tel, sendDate)
            .then((result) => result)
            .catch((err) => console.error('err: ', err))
        : await sendSMS(message, patient.tel);
    }

    if (sendBy.includes('system')) {
      success = sendDate
        ? await scheduleFCM(subject, message, token, sendDate)
            .then((result) => result)
            .catch((err) => console.error('err: ', err))
        : await sendFCM(subject, message, token);
    }
    
    if (!success)
      return res.status(400).json({ error: 'Notification Not Sent!' });

    // add Notification
    await Notification.create({
      subject,
      message,
      sendDate,
      patient: patientId,
      sendBy,
    });
    return res.status(200).json({ message: 'Notification Sent!' });
  } catch (err) {
    next(err);
  }
};
