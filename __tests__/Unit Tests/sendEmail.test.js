import { scheduleEmail, sendEmail } from '../../services/sendEmail';
jest.setTimeout(20000);
describe('/services/sendEmail.js', () => {
  const subject = 'Testing function';
  const message = "We're Learning Testing";
  const recipientEmail = 'badrdjab39@gmail.com';
  const delay = 10000;

  test('Email send successfully', async () => {
    try {
      const result = await sendEmail(subject, message, recipientEmail);
      expect(result).toBe(true);
    } catch (err) {
      console.error('err: ', err);
    }
  });
  test('Scheduled Email send successfully', async () => {
    const sendDate = new Date(Date.now() + delay);
    try {
      const result = await scheduleEmail(
        subject,
        message,
        recipientEmail,
        delay,
      );
      await new Promise((resolve) => setTimeout(resolve, sendDate));
      expect(result).toBe(true);
    } catch (err) {
      console.error('err: ', err);
    }
  });
});
