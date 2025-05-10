// libs
import { config } from 'dotenv';
import nodemailer from 'nodemailer';

// utils
import scheduleTask from '../utils/scheduleTask.js';

config();

const sendEmail = async (subject, message, recipientEmail) => {
  if (!subject || !message || !recipientEmail) return;
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // can be other services like Outlook or Yahoo
    auth: {
      user: process.env.USER_EMAIL, // your email address
      pass: process.env.USER_PASS, // your email password or app-specific password
    },
  });

  // Define the mail options
  const mailOptions = {
    from: process.env.USER_EMAIL, // sender address
    to: recipientEmail, // list of receivers
    subject, // subject line
    text: message, // plain text body
    html: `<p>${message}</p>`, // HTML body
  };
  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

const scheduleEmail = async (subject, message, recipientEmail, sendDate) => {
  if(!subject || !message || !recipientEmail || !sendDate) return;
  return await scheduleTask(sendEmail, [subject, message, recipientEmail], sendDate);
};

export { scheduleEmail, sendEmail };
