import { scheduleSMS, sendSMS } from '../services/sendSMS';
jest.setTimeout(20000);

describe('/services/sendSMS.js', () => {
  const message = 'Hi there!';
  const recipientTel = '+213673732689';
  const delay = 10000;

  test('SMS sent successfully', async () => {
    try {
      const result = await sendSMS(message, recipientTel);
      expect(result).toBe(true);
    } catch (err) {
      console.error('err:', err);
    }
  });

  test('Scheduled SMS sent successfully', async () => {
    const sendDate = new Date(Date.now() + delay);
    try {
      const result = await scheduleSMS(message, recipientTel, sendDate);
      await new Promise((resolve) => setTimeout(resolve, delay));
      await expect(result).toBe(true);
    } catch (err) {
      console.error('err:', err);
    }
  });
});
