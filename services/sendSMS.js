import twilio from "twilio"; // Or, for ESM: import twilio from "twilio";
import {config} from "dotenv";
config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendSMS(message, recipientTel) {
  const msg = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: recipientTel,
  });

  console.log(msg.body, msg.sid);
  return true;
}

const scheduleSMS = (message, recipientTel, sendDate) => {
  const currentDate = new Date();
  const delay = sendDate - currentDate;

  if (delay < 0) {
    console.log("Send date is in the past. SMS will not be sent.");
    return;
  }

  setTimeout(() => {
    sendSMS(message, recipientTel);
  }, delay);
};

export { scheduleSMS, sendSMS };
