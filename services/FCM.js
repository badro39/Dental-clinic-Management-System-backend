// dev mode
import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccount.json' assert { type: 'json' };
import scheduleTask from '../utils/scheduleTask.js';

// // other modes
// const admin = require('firebase-admin');
// const serviceAccount = require('../config/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send a notification
export const sendFCM = async (token, title, body) => {
  if (!token || !title || !body) return;

  const message = {
    notification: { title, body },
    token, // The FCM token of the device you want to send the notification to
  };

  try {
    await admin.messaging().send(message);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

export const scheduleFCM = async (title, body, token, sendDate) => {
  return scheduleTask(sendFCM, [token, title, body], sendDate);
};
