// // dev mode
// import admin from 'firebase-admin';
// import serviceAccount from '../config/serviceAccount.json' assert { type: 'json' };

// other modes
const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send a notification
export const sendFCM = async (token, title, body) => {
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
  const delay = new Date(sendDate) - new Date();
  if (delay < 0) {
    throw new Error('Send date must be in the future');
  }
  setTimeout(async () => {
    try {
      await sendFCM(token, title, body);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }, delay);
};
