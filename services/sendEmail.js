import nodemailer from 'nodemailer';
import {config} from 'dotenv';
config();

async function sendEmail(subject, message, recipientEmail) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // can be other services like Outlook or Yahoo
    auth: {
      user: process.env.USER_EMAIL, // your email address
      pass: process.env.USER_PASS,  // your email password or app-specific password
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
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
      return;
    }
    console.log('Email sent: ' + info.response);
  });
  return true;
}

const scheduleEmail = (subject, message, recipientEmail, sendDate) => {
  const currentDate = new Date();
  const delay = sendDate - currentDate;

  if (delay < 0) {
    console.log('Send date is in the past. Email will not be sent.');
    return;
  }

  setTimeout(() => {
    sendEmail(subject, message, recipientEmail);
  }, delay);
};

export {sendEmail, scheduleEmail};
