// libs
import { config } from 'dotenv';
import twilio from 'twilio'; // Or, for ESM: import twilio from "twilio";

// utils
import scheduleTask from '../utils/scheduleTask.js';

config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (message, recipientTel) => {
  if (!message || !recipientTel) return;
  await client.messages.create({
    body: message,
    from: "+213673667905",
    to: recipientTel,
  });
  return true;
}

const scheduleSMS = async (message, recipientTel, sendDate) => {
  return await scheduleTask(sendSMS, [message, recipientTel], sendDate);
};

export { scheduleSMS, sendSMS };
