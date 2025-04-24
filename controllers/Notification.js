// models
import Notification from '../models/notification.js';
import { Patient } from '../models/user.js';

// services
import { scheduleEmail, sendEmail } from '../services/sendEmail.js';
import { scheduleSMS, sendSMS } from '../services/sendSMS.js';
import { sendFCM, scheduleFCM } from '../services/FCM.js';

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
  const { subject, message, sendDate, patientId, sendBy } = req.sanitizedBody;
  try {
    const patient = await Patient.findById(patientId);
    let success;
    if (patient.length == 0)
      return res.status(404).json({ error: 'Patient Not Found!' });
    if (sendBy.includes('email')) {
      success = sendDate
        ? scheduleEmail(subject, message, patient.email, sendDate)
        : sendEmail(subject, message, patient.email);
    }

    if (sendBy.includes('sms')) {
      success = sendDate
        ? scheduleSMS(message, patient.tel, sendDate)
        : sendSMS(message, patient.tel);
    }

    if(sendBy.includes("system")){
      success = sendDate
        ? scheduleFCM(subject, message, token, sendDate)
        : sendFCM(subject, message, token);
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
