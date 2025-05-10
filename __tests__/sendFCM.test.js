import { scheduleFCM, sendFCM } from "../services/FCM";

describe('/services/sendFCM.js', () => {
  const token = 'your-fcm-token';
  const title = 'Test Title';
  const body = 'Test Body';
  const delay = 10000; 

  test('FCM sent successfully', async () => {
    try {
      const result = await sendFCM(token, title, body);
      expect(result).toBe(true);
    } catch (err) {
      console.error('err:', err);
    }
  });
  test('Scheduled FCM sent successfully', async () => {
    const sendDate = new Date(Date.now() + delay);
    try {
      const result = await scheduleFCM(token, title, body);
      await new Promise((resolve) => setTimeout(resolve, sendDate))
      expect(result).toBe(true);
    } catch (err) {
      console.error('err:', err);
    }
  });
});
